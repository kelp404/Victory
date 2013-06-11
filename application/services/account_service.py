
from flask import g
from application.data_models.user_model import *
from application.models.user_view_model import *
from application.services.base_service import BaseService
from google.appengine.ext import db
from google.appengine.api import mail
from google.appengine.api import users
from application import config
import logging


class AccountService(BaseService):
    """
    Account Service
    """
    def authorization(self):
        """
        User Authorization.
        * Do not use return object to update user entity.

        @returns UserModel / None
        """
        google_user = users.get_current_user()
        if google_user: google_user = google_user.email().lower()
        if google_user is None: return None

        total_user = db.GqlQuery('select * from UserModel limit 1')
        if total_user.count(1) == 0:
            # set up default user with google account
            user = UserModel()
            user.email = google_user
            user.name = google_user
            user.level = UserLevel.root
            user.put()
            user.get(user.key())    # sync
            return user

        if google_user:
            # auth with google account
            members = db.GqlQuery('select * from UserModel where email = :1 limit 1', google_user).fetch(1)
            if len(members) > 0:
                return members[0]
            elif config.allow_register:
                # register a new user
                user = UserModel()
                user.email = google_user
                user.name = google_user
                user.put()
                user.get(user.key())    # sync
                return user

        return None

    def update_profile(self, name):
        """
        Update user's profile

        @param name user's name
        @returns True, user name / False, None
        """
        # clear up input value
        if name is None: return False, None
        name = name.strip()

        # check auth
        if g.user is None: return False, None

        if len(name) > 0:
            user = UserModel().get_by_id(g.user.key().id())
            user.name = name
            user.put()
            user.get(user.key())    # sync
            return True, name

        return False, None

    def invite_user(self, email):
        """
        Invite user to join Takanash with email

        @param email invited user's email
        @returns UserModel(new user) / None
        """
        # clear up input value
        if email is None: return None
        email = email.strip().lower()

        # check auth
        if g.user is None: return None

        user = db.GqlQuery('select * from UserModel where email = :1 limit 1', email)
        if user.count(1) > 0:
            # user is exist
            return UserModel().get(user[0])

        # add a new user
        user = UserModel()
        user.email = email
        user.name = email
        user.put()

        # send a invite email
        message = mail.EmailMessage(sender=config.gae_account, subject="%s has invited you to join Victory." % g.user.name)
        message.to = email
        message.body = 'Victory https://%s\n\nAccount: %s' % (config.domain, email)
        message.send()

        user.get(user.key())    #sync
        return user

    def get_users(self):
        """
        Get all users (for root)

        @returns [UserViewModel] / []
        """
        # check auth
        if g.user is None: return []
        if g.user.level != UserLevel.root: return []

        result = []
        members = db.GqlQuery('select * from UserModel order by create_time')
        for user in members:
            result.append(UserViewModel(
                user_id= user.key().id(),
                is_root= user.level == UserLevel.root,
                is_deletable= user.level != UserLevel.root,
                name= user.name,
                email= user.email,
                create_time= user.create_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
            ))
        return result

    def delete_user(self, user_id):
        """
        Delete user with id (for root)

        @param user_id user id
        @returns True / False
        """
        # clear input value
        try: user_id = long(user_id)
        except: return False

        # check auth
        if g.user is None: return False
        if g.user.level != UserLevel.root: return False

        # delete self
        if user_id == g.user.key().id(): return False

        user = UserModel.get_by_id(user_id)
        if user is None : return False

        # delete relational from application
        applications = db.GqlQuery('select * from ApplicationModel where viewer in :1', [user_id])
        for application in applications:
            application.viewer.remove(user_id)
            application.put()
        applications = db.GqlQuery('select * from ApplicationModel where owner = :1', user_id)
        for application in applications:
            application.delete()

        # delete user
        user.delete()
        return True
