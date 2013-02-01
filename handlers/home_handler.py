

from handlers.base_handler import BaseHandler
import logging


class HomeHandler(BaseHandler):

    def get(self):
        self.redirect('/exception_groups')

    def post(self):
        return self.get()


