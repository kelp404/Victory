

from handlers.base_handler import BaseHandler
from services.document_service import *
import urllib2
import logging
import json
from google.appengine.ext import webapp

class ExceptionDocumentHandler(BaseHandler):
    def post(self, key=None):
        wh = WSHelper()
        document = wh.get_request_document(self.request)

        if document:
            ds = DocumentService(self.context)
            result, msg = ds.add_document(key, document, DocumentModel.exception)
            self.json({ 'success': result, 'message': msg })
        else:
            self.json({ 'success': False, 'message': 'input error' })



class LogDocumentHandler(BaseHandler):
    def post(self, key=None):
        wh = WSHelper()
        document = wh.get_request_document(self.request)

        if document:
            ds = DocumentService(self.context)
            result, msg = ds.add_document(key, document, DocumentModel.log)
            self.json({ 'success': result })
        else:
            self.json({ 'success': False, 'message': 'input error' })



class WSHelper(object):
    # success: return a document of request body
    # fail: return none
    def get_request_document(self, request):
        if 'Content-Type' in request.headers and request.headers['Content-Type'].find('application/x-www-form-urlencoded') >= 0:
            # data format: application/x-www-form-urlencoded
            pars = {}
            for item in request.body.split('&'):
                set = item.split('=')
                if len(set) == 2:
                    pars[urllib2.unquote(set[0])] = urllib2.unquote(set[1]).decode('utf-8')
        else:
            # data format: application/json
            try:
                pars = json.loads(request.body)
            except:
                return None

        return pars