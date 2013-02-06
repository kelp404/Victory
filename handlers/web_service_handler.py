

from handlers.base_handler import BaseHandler
from services.document_service import *
import urllib2
import logging
import json

class CrashDocumentHandler(BaseHandler):
    def post(self, key=None):
        """
        Add a crash document
        """
        if 'Content-Type' not in self.request.headers or self.request.headers['Content-Type'].find('multipart/form-data') < 0:
            self.json({ 'success': False, 'message': 'input error' })
            return

        reports = json.loads(self.request.get('reports'))
        if reports:
            ds = DocumentService(self.context)
            for report in reports:
                title = ['%s  %s' % (x['backtrace']['contents'][0]['object_name'], x['backtrace']['contents'][0]['symbol_name']) for x in report['crash']['threads'] if x['crashed']]
                document = { 'report': report, 'name': report['user']['name'], 'title': title }
                result, msg = ds.add_document(key, document, DocumentModel.crash)
                if not result:
                    # error
                    self.json({ 'success': False, 'message': msg })
                    return

            # success
            self.json({ 'success': True, 'message': None })
            return

        self.json({ 'success': False, 'message': 'input error' })


class ExceptionDocumentHandler(BaseHandler):
    def post(self, key=None):
        """
        Add a exception document
        """
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
        """
        Add a log document
        """
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