
from flask import request, jsonify
from application.services.document_service import *
import json


def CrashDocumentAdd(key=None):
    """
    POST: api/vX/crash/<application_key>
    add a crash document by web service
    """
    if 'Content-Type' not in request.headers or request.headers['Content-Type'].find('multipart/form-data') < 0:
        return jsonify({ 'success': False, 'message': 'input error' })
    reports = request.files.getlist('reports')

    if reports:
        ds = DocumentService()
        for report in reports:
            documents = json.loads(report.read())
            if not isinstance(documents, list): documents = [documents]
            for document in documents:
                result, msg = ds.add_document(key, document, DocumentModel.crash)
                if not result:
                    # error
                    return jsonify({ 'success': False, 'message': msg })

        # success
        return jsonify({ 'success': True, 'message': None })
    # no reports
    return jsonify({ 'success': False, 'message': 'input error' })

def ExceptionDocumentAdd(key=None):
    """
    POST: api/vX/exception/<application_key>
    add a exception document by web service
    """
    wh = WSHelper()
    document = wh.get_request_document()

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.exception)
        return jsonify({ 'success': result, 'message': msg })
    else:
        return jsonify({ 'success': False, 'message': 'input error' })

def LogDocumentAdd(key=None):
    """
    POST: api/vX/log/<application_key>
    add a log document by web service
    """
    wh = WSHelper()
    document = wh.get_request_document()

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.log)
        return jsonify({ 'success': result, 'message': msg })
    else:
        return jsonify({ 'success': False, 'message': 'input error' })


class WSHelper(object):
    def get_request_document(self):
        """
        parse request

        @param request flask.request
        @returns document object / None
        """
        if 'Content-Type' in request.headers and request.headers['Content-Type'].find('application/x-www-form-urlencoded') >= 0:
            # data format: application/x-www-form-urlencoded
            pars = {}
            for key in request.form:
                pars[key] = request.form.get(key)
        else:
            # data format: application/json
            try: pars = json.loads(request.data)
            except: return None

        return pars