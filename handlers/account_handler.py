

from handlers.base_handler import BaseHandler
from google.appengine.api import users
import logging


class LoginHandler(BaseHandler):
    def get(self):
        if self.user is not None:
            self.redirect('/')
            return

        self.view_model['title'] = 'Sign in - '
        self.view_model['login_url'] = users.create_login_url()
        return self.render_template('login.html', **self.view_model)

