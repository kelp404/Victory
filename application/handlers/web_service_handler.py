
# python
import json

# flask
from flask import request, jsonify, Response, abort

# victory
from application.services.document_service import *



def crash_document_add(key=None):
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
                    return abort(417, {'message': msg})
        # success
        return jsonify({'success': True, 'message': None})
    # no reports
    return abort(400, {'message': 'input error'})


def exception_document_add_jsonp(key=None):
    """
    GET: api/vX/exception/<application_key>
    add a exception document by JSONP
    """
    return exception_document_add(key, is_jsonp=True)
def exception_document_add(key=None, is_jsonp=False):
    """
    POST: api/vX/exception/<application_key>
    add a exception document by web service
    """
    document = __get_request_document(is_jsonp)

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.exception)
        if result:  # successful
            if is_jsonp:    # jsonp
                json_string = json.dumps({'success': result, 'message': msg})
                return Response('%s(%s)' % (request.args.get('callback'), json_string), mimetype='application/json')
            else:   # json
                return jsonify({'success': result, 'message': msg})
        else:   # failed
            return abort(417, {'message': msg})
    else:   # bad request
        return abort(400, {'message': 'input error'})


def log_document_add_jsonp(key=None):
    """
    GET: api/vX/log/<application_key>
    add a log document by JSONP
    """
    return log_document_add(key, is_jsonp=True)
def log_document_add(key=None, is_jsonp=False):
    """
    POST: api/vX/log/<application_key>
    add a log document by web service
    """
    document = __get_request_document(is_jsonp)

    if document:
        ds = DocumentService()
        result, msg = ds.add_document(key, document, DocumentModel.log)
        if result:  # successful
            if is_jsonp:    # jsonp
                json_string = json.dumps({'success': result, 'message': msg})
                return Response('%s(%s)' % (request.args.get('callback'), json_string), mimetype='application/json')
            else:   # json
                return jsonify({'success': result, 'message': msg})
        else:   # failed
            return abort(417, {'message': msg})
    else:   # bad request
        return abort(400, {'message': 'input error'})


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
        try:
            pars = json.loads(request.data)
        except:
            return None

    return pars