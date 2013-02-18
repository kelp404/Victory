
from flask import request, jsonify, jsonpify
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


def ExceptionDocumentAddJSONP(key=None):
    """
    GET: api/vX/exception/<application_key>
    add a exception document by JSONP
    """
    return ExceptionDocumentAdd(key, is_jsonp=True)
def ExceptionDocumentAdd(key=None, is_jsonp=False):
    """
    POST: api/vX/exception/<application_key>
    add a exception document by web service
    """
    document = __get_request_document(is_jsonp)

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.exception)
        result = { 'success': result, 'message': msg }
    else:
        result = { 'success': False, 'message': 'input error' }

    if is_jsonp: return jsonpify(result)
    else: return jsonify(result)


def LogDocumentAddJSONP(key=None):
    """
    GET: api/vX/log/<application_key>
    add a log document by JSONP
    """
    return LogDocumentAdd(key, is_jsonp=True)
def LogDocumentAdd(key=None, is_jsonp=False):
    """
    POST: api/vX/log/<application_key>
    add a log document by web service
    """
    document = __get_request_document(is_jsonp)

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.log)
        result = { 'success': result, 'message': msg }
    else:
        result = { 'success': False, 'message': 'input error' }

    if is_jsonp: return jsonpify(result)
    else: return jsonify(result)


def __get_request_document(is_jsonp=False):
    """
    parse request

    @param request flask.request
    @returns document object / None
    """
    if is_jsonp:
        # jsonp
        pars = request.args
    elif 'Content-Type' in request.headers and request.headers['Content-Type'].find('application/x-www-form-urlencoded') >= 0:
        # data format: application/x-www-form-urlencoded
        pars = request.form
    else:
        # data format: application/json
        try: pars = json.loads(request.data)
        except: return None

    return pars