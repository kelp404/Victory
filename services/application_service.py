
from data_models.application_model import *
from data_models.user_model import *
from services.base_service import *
from google.appengine.ext import db
import uuid
import logging

class ApplicationService(BaseService):
    def get_applications(self, with_members=False):
        """
        Get all my applications

        @param with_members True: append application.members
        @returns [application] / []
        """
        # check auth
        if self.context.user is None: return []

        if self.context.user.level == UserLevel.root:
            owner_apps = db.GqlQuery('select * from ApplicationModel order by create_time')
            viewer_apps = []
        else:
            owner_apps = db.GqlQuery('select * from ApplicationModel where owner = :1 order by create_time', self.context.user.key().id())
            viewer_apps = db.GqlQuery('select * from ApplicationModel where viewer in :1 order by create_time', [self.context.user.key().id()])

        result = []
        for item in owner_apps:
            app = item.dict()
            app['is_owner'] = True
            if with_members:
                # add user info to the application
                members = [self.__get_member_for_application(self.context.user, True)]
                if self.context.user.key().id() != item.owner:
                    members.append(self.__get_member_for_application(UserModel().get_by_id(item.owner), True))
                for user_id in [x for x in item.viewer if x != self.context.user.key().id()]:
                    user = UserModel().get_by_id(user_id)
                    if user:
                        members.append(self.__get_member_for_application(user, False))
                app['members'] = members
            result.append(app)
        for item in viewer_apps:
            app = item.dict()
            app['is_owner'] = False
            if with_members:
                # add user info of the application
                owner = UserModel().get_by_id(item.owner)
                members = [self.__get_member_for_application(owner, False)]
                for user_id in item.viewer:
                    user = UserModel().get_by_id(user_id)
                    if user and user.level != UserLevel.root:
                        members.append(self.__get_member_for_application(user, user.key().id() == self.context.user.key().id()))
                app['members'] = members
            result.append(app)
        return result
    def __get_member_for_application(self, user, is_owner):
        result = {'name': user.name,
                  'email': user.email,
                  'id': user.key().id(),
                  'is_owner': is_owner}
        return result

    def is_my_application(self, application_id, check_is_owner=False):
        """
        Check the application is mine

        @param application_id application id
        @param check_is_owner True: am I owner? / False: am I owner or viewer?
        @returns True / False
        """
        try: application_id = long(application_id)
        except: return False
        # no id or no application
        if application_id is None or application_id == 0: return False

        # check auth
        if self.context.user is None: return False

        # query by root
        if self.context.user.level == UserLevel.root: return True

        app = ApplicationModel().get_by_id(application_id)
        if check_is_owner:
            return app.owner == self.context.user.key().id()
        else:
            return app.owner == self.context.user.key().id() or self.context.user.key().id() in app.viewer

    def add_application(self, name, description):
        """
        Add an application

        @param name application name (required)
        @param description application description
        @returns True / False
        """
        # clear up input value
        if name is None: return False
        name = name.strip()
        description = description.strip()
        if len(name) == 0: return False

        # check auth
        if self.context.user is None: return False

        app = ApplicationModel()
        app.app_name = name
        app.description = description
        app.app_key = str(uuid.uuid4())
        app.owner = self.context.user.key().id()
        app.put()
        return True

    def delete_application(self, application_id):
        """
        Delete the application with application id

        @param application_id application id
        @returns True / False
        """
        try: application_id = long(application_id)
        except: return False
        if not self.is_my_application(application_id, True): return False

        # delete the application
        app = ApplicationModel().get_by_id(application_id)
        app.delete()

        return True

    def update_application(self, application_id, name, description):
        """
        Update the application

        @param application_id application id
        @param name the new application name
        @param description the new application description
        @returns True / False
        """
        try: application_id = long(application_id)
        except: return False
        # check auth
        if not self.is_my_application(application_id, True): return False

        # clear up input value
        if name is None: return False
        name = name.strip()
        description = description.strip()
        if len(name) == 0: return False

        app = ApplicationModel().get_by_id(application_id)
        if app:
            app.app_name = name
            app.description = description
            app.put()
            return True

        return False

    def add_user_to_application(self, user_id, application_id):
        """
        Add a user to the application (viewer)

        @param user_id user id
        @param application_id application id
        @returns True / False
        """
        # check input value
        if user_id is None or application_id is None: return False
        try:
            user_id = long(user_id)
            application_id = long(application_id)
        except: return False

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id not in application.viewer and user_id != application.owner:
            application.viewer.append(user_id)
            application.put()
            return True
        else:
            return False

    def delete_user_from_application(self, user_id, application_id):
        """
        Delete a viewer from the application

        @param user_id user id
        @param application_id application id
        @returns True / False
        """
        # check input value
        if user_id is None or application_id is None: return False
        try:
            user_id = long(user_id)
            application_id = long(application_id)
        except: return False

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id in application.viewer:
            application.viewer.remove(user_id)
            application.put()
            return True
        else:
            return False
