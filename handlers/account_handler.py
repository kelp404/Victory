

from handlers.base_handler import BaseHandler
from services.account_service import AccountService
import logging


class LoginHandler(BaseHandler):
    def get(self):
        if self.user is not None:
            self.redirect('/')
            return

        self.view_model['title'] = 'Sign in - '
        return self.render_template('login.html', **self.view_model)

    def post(self):
        if self.user is not None:
            self.redirect('/')
            return

        account = self.request.get('account')
        password = self.request.get('password')

        acs = AccountService(self.context)
        success, cookie = acs.login(account, password)

        return self.json({ 'success': success, 'cookie': cookie })


class ReInviteHandler(BaseHandler):
    def post(self, user_id):
        try: user_id = long(user_id)
        except:
            self.json({ 'success': False })
            return

        acs = AccountService(self.context)
        self.json({ 'success': acs.resend_email_to_pending_user(user_id) })



class ForgotPasswordHandler(BaseHandler):
    def post(self):
        email = self.request.get('account')

        acs = AccountService(self.context)
        return self.json({ 'success': acs.forgot_password(email) })
