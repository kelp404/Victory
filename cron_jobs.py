
import webapp2
from data_models.session_model import *
from data_models.log_model import *
from data_models.exception_model import *
from google.appengine.ext import db
from google.appengine.api import search
import datetime
import config
import logging

# clear session data
class ClearSessionsHandler(webapp2.RequestHandler):
    def get(self):
        date_tag = datetime.datetime.now() - datetime.timedelta(days=config.session_expiration)
        sessions = db.GqlQuery('select * from SessionModel where create_time < :1', date_tag)
        for session in sessions:
            session.delete()

# clear document data
class ClearDocumentsHandler(webapp2.RequestHandler):
    def get(self):
        date_tag = datetime.datetime.now() - datetime.timedelta(days=config.document_expiration)
        options = search.QueryOptions(returned_fields = [])
        query = search.Query(query_string='create_time<=%s' % date_tag.strftime('%Y-%m-%d'), options=options)
        # clear documents
        self.__delete_text_search('ExceptionModel', query)
        self.__delete_text_search('LogModel', query)
        self.__delete_data_store('ExceptionModel', date_tag)
        self.__delete_data_store('LogModel', date_tag)

    def __delete_text_search(self, model_name, query):
        index = search.Index(name=model_name)
        while True:
            documents = index.search(query)
            if documents.number_found == 0: break

            # delete document in text search
            document_ids = [x.doc_id for x in documents]
            index.delete(document_ids)

    def __delete_data_store(self, model_name, date_tag):
        while True:
            query = db.GqlQuery('select * from %s where create_time < :1' % model_name, date_tag)
            if query.count(1) == 0: break
            models = query.fetch(1000)
            db.delete(models)


app = webapp2.WSGIApplication([
    ('/cron_jobs/session', ClearSessionsHandler),
    ('/cron_jobs/document', ClearDocumentsHandler)
])