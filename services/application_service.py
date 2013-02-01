
from data_models.application_model import *
from data_models.user_model import *
from services.base_service import *
from google.appengine.ext import db
from google.appengine.api import search
import uuid
import logging

class ApplicationService(BaseService):
    # get all applications, if with_members is True then append application.members
    # success: return [application]
    # fail: return []
    def get_applications(self, with_members=False):
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
                for user_id in item.viewer:
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
                    if user:
                        members.append(self.__get_member_for_application(user, user.key().id() == self.context.user.key().id()))
                app['members'] = members
            result.append(app)
        return result

    def __get_member_for_application(self, user, is_owner):
        result = {'name': user.name,
                  'email': user.email,
                  'id': user.key().id(),
                  'is_owner': is_owner,
                  'is_pending': user.level == UserLevel.pending}
        return result


    # check the application is mine (owner check_is_owner = True
    # check the application is mine (viewer check_is_owner = False
    def is_my_application(self, application_id, check_is_owner=False):
        # no id or application
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


    # add a new application
    def add_application(self, name, description):
        # no login
        if self.context.user is None: return False

        # clear up input value
        if name is None: return False
        name = name.strip()
        description = description.strip()
        if len(name) == 0: return False

        app = ApplicationModel()
        app.app_name = name
        app.description = description
        app.app_key = str(uuid.uuid4())
        app.owner = self.context.user.key().id()
        app.put()
        return True

    # delete the application.
    def delete_application(self, id):
        if not self.is_my_application(id, True): return False

        # delete the application
        app = ApplicationModel().get_by_id(id)
        app.delete()

        # delete text search for ExceptionModel
        index = search.Index(name='ExceptionModel')
        while True:
            options = search.QueryOptions(returned_fields=[])
            query = search.Query(query_string='app_id:%s' % id, options=options)
            document_ids = [document.doc_id for document in index.search(query)]
            if not document_ids: break
            index.delete(document_ids=document_ids)

        # delete text search for LogModel
        index = search.Index(name='LogModel')
        while True:
            options = search.QueryOptions(returned_fields=[])
            query = search.Query(query_string='app_id:%s' % id, options=options)
            document_ids = [document.doc_id for document in index.search(query)]
            if not document_ids: break
            index.delete(document_ids=document_ids)

        exceptions = db.GqlQuery('select * from ExceptionModel where app_id = :1', id)
        for exception in exceptions:
            exception.delete()
        logs = db.GqlQuery('select * from LogModel where app_id = :1', id)
        for log in logs:
            log.delete()
        return True

    # update the application.
    def update_application(self, id, name, description):
        if not self.is_my_application(id, True): return False

        # clear up input value
        if name is None: return False
        name = name.strip()
        description = description.strip()
        if len(name) == 0: return False

        app = ApplicationModel().get_by_id(id)
        if app:
            app.app_name = name
            app.description = description
            app.put()
            return True

        return False


    # add a user to application (viewer)
    def add_user_to_application(self, user_id, application_id):
        # check input value
        if user_id is None or application_id is None: return False

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id not in application.viewer and user_id != application.owner:
            application.viewer.append(user_id)
            application.put()
            return True
        else:
            return False

    # delete a viewer from application
    def delete_user_from_application(self, user_id, application_id):
        # check input value
        if user_id is None or application_id is None: return False

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id in application.viewer:
            application.viewer.remove(user_id)
            application.put()
            return True
        else:
            return False
