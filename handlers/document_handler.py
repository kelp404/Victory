

from handlers.base_handler import BaseHandler
from services.document_service import *
import config
import datetime, copy
import logging


class DocumentHandler(BaseHandler):
    # get document groups
    def get(self, application_id=None, group_tag=None):
        try: index = int(self.request.get('index'))
        except: index = 0
        try: application_id = long(application_id)
        except: application_id = 0
        keyword = self.request.get('q')
        self.view_model['keyword'] = keyword

        # document type
        if self.request.route.name[:10] == 'exception_':
            document_model = DocumentModel.exception
            self.view_model['document_model'] = 'exception'
            self.view_model['title'] = 'Handled Exceptions - '
        else:
            document_model = DocumentModel.log
            self.view_model['document_model'] = 'log'
            self.view_model['title'] = 'Logs - '

        # get applications
        aps = ApplicationService(self.context)
        applications = aps.get_applications()
        self.view_model['applications'] = applications

        if application_id == 0:
            # input value has no application id
            if len(applications) > 0:
                # result a default application
                application_id = applications[0]['id']
                self.view_model['selected_application'] = applications[0]['name']
                self.view_model['application_id'] = application_id
            else:
                # no input value and no applications
                self.view_model['page'] = { 'items': [], 'total': 0, 'index': index, 'size': config.page_size, 'max': 0 }
                self.view_model['documents'] = []
                return self.render_template('document_groups.html', **self.view_model)
        else:
            select_application = [x for x in applications if x['id'] == application_id]
            if select_application:
                # input value in application list
                self.view_model['selected_application'] = select_application[0]['name']
                self.view_model['application_id'] = application_id
            else:
                # selected id is not in owner applications
                self.abort(404)

        ds = DocumentService(self.context)
        if group_tag is None:
            # get document groups of the application
            result, total = ds.get_document_groups(application_id, keyword, index, document_model)
            self.view_model['page'] = {
                'items': result,
                'total': total,
                'index': index,
                'size': config.page_size,
                'max': (total - 1) / config.page_size
            }
            documents = []
            for item in result:
                if item['times'] == 1:
                    document = ds.get_last_document(application_id, item['group_tag'], document_model)
                    if document: documents.append(document)
            self.view_model['documents'] = documents

            return self.render_template('document_groups.html', **self.view_model)
        else:
            # get documents
            result = ds.get_documents(application_id, group_tag, document_model)
            if len(result) == 0: self.abort(404)
            self.view_model['result'] = result
            return self.render_template('documents.html', **self.view_model)
