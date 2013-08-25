
# python
import uuid

# flask
from flask import g, abort

# google
from google.appengine.ext import db
from google.appengine.api import search

# victory
from application.models.datastore.application_model import *
from application.models.datastore.user_model import *
from base_service import *



class ApplicationService(BaseService):
    def get_applications(self, with_members=False):
        """
        Get all my applications

        @param with_members True: append application.members
        @returns [application] / []
        """
        if g.user.level == UserLevel.root:
            owner_apps = db.GqlQuery('select * from ApplicationModel order by create_time')
            viewer_apps = []
        else:
            owner_apps = db.GqlQuery('select * from ApplicationModel where owner = :1 order by create_time', g.user.key().id())
            viewer_apps = db.GqlQuery('select * from ApplicationModel where viewer in :1 order by create_time', [g.user.key().id()])

        result = []
        for item in owner_apps:
            app = item.dict()
            app['is_owner'] = True
            if with_members:
                # add user info to the application
                members = [self.__get_member_for_application(g.user, True)]
                if g.user.key().id() != item.owner:
                    members.append(self.__get_member_for_application(UserModel().get_by_id(item.owner), True))
                for user_id in [x for x in item.viewer if x != g.user.key().id()]:
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
                        members.append(self.__get_member_for_application(user, user.key().id() == g.user.key().id()))
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
        try:
            application_id = long(application_id)
        except Exception:
            return abort(400)

        # no id or no application
        if application_id is None or application_id == 0:
            return abort(400)

        # no application
        app = ApplicationModel().get_by_id(application_id)
        if app is None:
            return abort(404)

        # query by root
        if g.user.level == UserLevel.root:
            return True

        if check_is_owner:
            return app.owner == g.user.key().id()
        else:
            return app.owner == g.user.key().id() or g.user.key().id() in app.viewer

    def add_application(self, name, description):
        """
        Add an application

        @param name application name (required)
        @param description application description
        """
        app = ApplicationModel()
        app.app_name = name
        app.description = description
        app.app_key = str(uuid.uuid4())
        app.owner = g.user.key().id()
        app.put()
        app.get(app.key())  # sync

    def delete_application(self, application_id):
        """
        Delete the application with application id

        :param application_id: application id
        """
        if not self.is_my_application(application_id, True):
            return abort(403)

        # delete the application
        app = ApplicationModel().get_by_id(application_id)
        if app is None:
            return abort(404)
        app.delete()

        # delete text search
        self.__clear_text_search(application_id, 'CrashModel')
        self.__clear_text_search(application_id, 'ExceptionModel')
        self.__clear_text_search(application_id, 'LogModel')

        app.get(app.key())  # sync

    def __clear_text_search(self, application_id, namespace):
        """
        Clear text search with application id
        :param application_id: long, application id
        :param namespace: text search schema namespace
        """
        index = search.Index(namespace=namespace, name=str(application_id))
        while True:
            # Get a list of documents populating only the doc_id field and extract the ids.
            document_ids = [document.doc_id for document in index.get_range(ids_only=True)]
            if not document_ids:
                break
                # Delete the documents for the given ids from the Index.
            index.delete(document_ids)

    def update_application(self, application_id, name, description):
        """
        Update the application

        :param application_id: application id
        :param name: the new application name
        :param description: the new application description
        :return: ApplicationModel
        """
        # check auth
        if not self.is_my_application(application_id, True):
            return abort(403)

        app = ApplicationModel().get_by_id(application_id)
        if app:
            app.app_name = name
            app.description = description
            app.put()
            app.get(app.key())  # sync
            return app

        return abort(404)

    def add_user_to_application(self, user_id, application_id):
        """
        Add a user to the application (viewer)

        :param user_id: user id
        :param application_id: application id
        """
        # check input value
        if user_id is None or application_id is None:
            return abort(400)

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id not in application.viewer and user_id != application.owner:
            application.viewer.append(user_id)
            application.put()
            application.get(application.key())  #sync
        else:
            return abort(403)

    def delete_user_from_application(self, user_id, application_id):
        """
        Delete a viewer from the application

        @param user_id user id
        @param application_id application id
        """
        # check input value
        if user_id is None or application_id is None:
            return abort(400)

        application = ApplicationModel.get_by_id(application_id)
        if self.is_my_application(application_id, True) and user_id in application.viewer:
            application.viewer.remove(user_id)
            application.put()
            application.get(application.key())  # sync
        else:
            return abort(403)
