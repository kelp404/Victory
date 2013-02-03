

from handlers.base_handler import BaseHandler
from services.account_service import AccountService
from services.application_service import *
import copy
import logging


class RedirectToApplicationHandler(BaseHandler):
    def get(self):
        self.redirect('/settings/applications')


# get profile page, update profile
class ProfileHandler(BaseHandler):
    def get(self):
        self.view_model['title'] = 'Profile - '
        return self.render_template('settings_profile.html', **self.view_model)

    # update profile
    def put(self):
        rq = copy.copy(self.request)
        rq.method = 'POST'
        name = rq.get('name')

        acs = AccountService(self.context)
        success, name = acs.update_profile(name)

        return self.json({ 'success': success, 'name': name })


class UsersHandler(BaseHandler):
    """
    Users management
    """
    def get(self):
        """
        List users
        """
        acs = AccountService(self.context)
        self.view_model['result'] = acs.get_users()
        return self.render_template('settings_users.html', **self.view_model)

    def post(self):
        """
        Invite user
        """
        email = self.request.get('email')
        acs = AccountService(self.context)
        self.json({ 'success': acs.invite_user(email) is not None })

    def delete(self, user_id):
        """
        Delete user
        """
        acs = AccountService(self.context)
        self.json({ 'success': acs.delete_user(user_id) })


class ApplicationsHandler(BaseHandler):
    def get(self):
        """
        List applications
        """
        self.view_model['title'] = 'Applications - '

        aps = ApplicationService(self.context)
        self.view_model['result'] = aps.get_applications(True)

        return self.render_template('settings_applications.html', **self.view_model)

    def post(self):
        """
        Add a new application
        """
        name = self.request.get('name')
        description = self.request.get('description')

        aps = ApplicationService(self.context)
        self.json({ 'success': aps.add_application(name, description) })

    def put(self, application_id):
        """
        Update the application (name, description)
        """
        try: application_id = long(application_id)
        except:
            self.json({ 'success': False })
            return

        # webapp2.Request.get() is just for POST arguments
        rq = copy.copy(self.request)
        rq.method = 'POST'
        name = rq.get('name')
        description = rq.get('description')

        aps = ApplicationService(self.context)
        self.json({ 'success': aps.update_application(application_id, name, description) })

    def delete(self, application_id):
        """
        delete an application with application id
        """
        aps = ApplicationService(self.context)
        self.json({ 'success': aps.delete_application(application_id) })


class ApplicationInviteHandler(BaseHandler):
    def post(self, application_id):
        """
        invite user to join the application
        """
        email = self.request.get('email')
        try: application_id = long(application_id)
        except:
            self.json({ 'success': False })
            return

        acs = AccountService(self.context)
        aps = ApplicationService(self.context)

        # am I owner?
        if not aps.is_my_application(application_id, True):
            self.json({ 'success': False })
            return

        # invite user
        user = acs.invite_user(email)
        if user is None:
            self.json({ 'success': False })
            return

        # add the new user to the application
        success = aps.add_user_to_application(user.key().id(), application_id)

        self.json({ 'success': success })


class ApplicationMemberHandler(BaseHandler):
    def delete(self, application_id, member_id):
        """
        remove the viewer in the application
        """
        try: application_id = long(application_id)
        except:
            self.json({ 'success': False })
            return
        try: member_id = long(member_id)
        except:
            self.json({ 'success': False })
            return

        aps = ApplicationService(self.context)
        success = aps.delete_user_from_application(member_id, application_id)

        self.json({ 'success': success })
