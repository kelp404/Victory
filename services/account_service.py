
from data_models.user_model import *
from data_models.session_model import *
from services.base_service import BaseService
from google.appengine.ext import db
from google.appengine.api import mail
from models.memcache_key import *
from google.appengine.api import memcache
import hashlib, os, uuid, string, random
import config
import logging


class AccountService(BaseService):
    # auth user by cookie
    # success: return UserModel
    # fail: return None
    def authorization(self, cookie):
        if cookie is None: return None

        sessions = db.GqlQuery('select * from SessionModel where cookie = :1 limit 1', cookie)
        if sessions.count(1) == 0:
            return None
        else:
            user = UserModel().get_by_id(sessions[0].user_id)
            if user:
                user.password = None
            return user

    # login with account and password
    # success: return True, cookie value
    # fail: return False, None
    def login(self, account, password):
        total_user = db.GqlQuery('select * from UserModel')
        if total_user.count(1) == 0:
            # set up default user
            user = UserModel()
            user.email = config.default_account_email
            user.name = config.default_account_name
            user.password = config.default_account_password
            user.level = UserLevel.root
            user.put()

        # clear up input value
        if account is None or password is None: return False, None
        account = account.strip().lower()

        users = db.GqlQuery('select * from UserModel where email = :1 limit 1', account)
        if users.count(1) == 0:
            return False, None
        else:
            password_hash = hashlib.sha256(password).hexdigest()
            user = UserModel().get_by_id(users[0].key().id())
            if user.password == password_hash:
                login_success = True
                if user.level == UserLevel.pending:
                    # first login
                    user.level = UserLevel.normal
                    user.put()
            else:
                # search password from cache (for reset password
                cache_value = memcache.get(key=MemcacheKey.forgot_password + str(user.key().id()))
                login_success = password_hash == cache_value

            if login_success:
                session = SessionModel()
                session.user_id = user.key().id()
                session.ip = os.environ["REMOTE_ADDR"]
                session.cookie = hashlib.sha224(str(uuid.uuid4()) + str(random.random())).hexdigest()
                session.user_agent = self.context.request.headers['User-Agent']
                session.put()
                return True, session.cookie

            return False, None

    # update profile
    # success: return True, user_name
    # fail: return False, None
    def update_profile(self, name):
        # clear up input value
        if name is None: return False, None
        name = name.strip()

        # check auth
        if self.context.user is None: return False, None

        if len(name) > 0:
            try:
                user = UserModel().get_by_id(self.context.user.key().id())
                user.name = name
                user.put()
                return True, name
            except:
                return False, None

        return False, None

    # update password
    # success: return True
    # fail: return False
    def update_password(self, old_password, new_password):
        # check auth
        if self.context.user is None: return False

        if self.context.user and old_password is not None and len(old_password) > 0 \
            and new_password is not None and len(new_password) > 0:
            old_password_hash = hashlib.sha256(old_password).hexdigest()

            user = UserModel().get_by_id(self.context.user.key().id())
            if user.password == old_password_hash:
                user.password = hashlib.sha256(new_password).hexdigest()
                user.put()
                return True
            else:
                # search password from cache (for reset password
                cache_key = MemcacheKey.forgot_password % str(user.key().id())
                cache_value = memcache.get(key=cache_key)
                if old_password_hash == cache_value:
                    memcache.delete(cache_key)
                    user.password = hashlib.sha256(new_password).hexdigest()
                    user.put()
                    return True

        return False

    # invite user with email
    # success: return UserModel
    # fail: return None
    def invite_user(self, email):
        # clear up input value
        if email is None: return None
        email = email.strip().lower()

        # check auth
        if self.context.user is None: return None

        user = db.GqlQuery('select * from UserModel where email = :1 limit 1', email)
        if user.count(1) > 0:
            # user is exist
            return UserModel().get(user[0].key())

        # add a new user
        password = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(5))
        user = UserModel()
        user.email = email
        user.name = email
        user.password = hashlib.sha256(password).hexdigest()
        user.put()

        # send a invite email
        message = mail.EmailMessage(sender=config.gae_account, subject="%s has invited you to join Takanashi." % self.context.user.name)
        message.to = email
        message.body = 'Takanashi https://%s\n\nAccount: %s\nPassword: %s\n\n*Please change your password after signing in.' % (config.domain, email, password)
        message.send()

        return user

    # resend invite email to pending user
    # success: return True
    # fail: return False
    def resend_email_to_pending_user(self, user_id):
        # check auth
        if self.context.user is None: return None

        user = UserModel.get_by_id(user_id)
        if user and user.level == UserLevel.pending:
            password = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(5))
            user.password = hashlib.sha256(password).hexdigest()
            user.put()

            # send a invite email
            message = mail.EmailMessage(sender=config.gae_account, subject="%s has invited you to join Takanashi." % self.context.user.name)
            message.to = user.email
            message.body = 'Takanashi https://%s\n\nAccount: %s\nPassword: %s\n\n*Please change your password after signing in.' % (config.domain, user.email, password)
            message.send()

            return True

        return False

    # generate a temporary password
    # success: return True
    # fail: return False
    def forgot_password(self, email):
        # clear up input value
        if email is None: return False
        email = email.strip().lower()

        users = db.GqlQuery('select * from UserModel where email = :1 limit 1', email)
        if users.count(1) <= 0: return False
        user = users[0]

        password = ''.join(random.choice(string.ascii_lowercase + string.digits) for x in range(8))
        cache_key = MemcacheKey.forgot_password + str(user.key().id())
        # 3600 seconds = 1 hours
        memcache.set(key=cache_key, value=hashlib.sha256(password).hexdigest(), time=3600)

        # send a reset password email
        message = mail.EmailMessage(sender=config.gae_account, subject="Takanashi forgot password.")
        message.to = email
        message.body = 'Takanashi https://%s\n\nAccount: %s\nPassword: %s\n\n*Please change your password in one hour.\nThis password will be disabled after one hour.' % (config.domain, email, password)
        message.send()

        return True

    # get all my sessions
    #   success: return [session]
    #   failed: return []
    def get_sessions(self):
        if self.context.user is None: return []

        sessions = db.GqlQuery('select * from SessionModel where user_id = :1 order by create_time DESC', self.context.user.key().id())
        result = []
        for session in sessions:
            result.append({ 'id': session.key().id(),
                            'is_current': session.cookie == str(self.context.request.cookies.get(config.cookie_auth)),
                            'ip': session.ip,
                            'user_agent': session.user_agent,
                            'create_time': session.create_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')})

        return result

    # logout
    #   success: return True
    #   failed: return False
    def logout(self, session_id=None):
        if self.context.user is None: return False
        session_id = long(session_id)

        cookie = str(self.context.request.cookies.get(config.cookie_auth))
        if session_id == 0:
            # logout current session
            sessions = db.GqlQuery('select * from SessionModel where cookie = :1 limit 1', cookie)
            sessions[0].delete()
        else:
            # logout the other session
            session = SessionModel().get_by_id(session_id)
            if session is None or session.user_id != self.context.user.key().id(): return False
            session.delete()

        return True