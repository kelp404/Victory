
# flask
from flask import request, abort, jsonify

# victory
from application.decorator.auth_decorator import *
from application.services.document_service import *



@authorization(UserLevel.normal)
def get_grouped_documents(application_id=None):
    """
    GET applications/<application_id>/<crashes/exceptions/logs>/grouped
    """
    # check value
    try:
        application_id = long(application_id)
    except Exception:
        return abort(400)
    try:
        index = int(request.args.get('index'))
    except Exception:
        index = 0
    keyword = request.args.get('q')
    if keyword is None:
        keyword = ''
    # documentModel
    if request.url_rule.endpoint.find('exception') >= 0:
        documentModel = DocumentModel.exception
    elif request.url_rule.endpoint.find('log') >= 0:
        documentModel = DocumentModel.log
    else:
        documentModel = DocumentModel.crash

    ds = DocumentService()
    docs, total = ds.get_grouped_documents(application_id, keyword, index, documentModel)

    for item in docs:
        if item['times'] == 1:
            # add detail info
            item.update(ds.get_last_document(application_id, item['group_tag'], documentModel))

    return jsonify({'items': docs, 'total': total})


@authorization(UserLevel.normal)
def get_documents(application_id=None, group_tag=None):
    """
    GET applications/<application_id>/<exceptions/logs>/<group_tag>
    """
    # check value
    try:
        application_id = long(application_id)
    except Exception:
        return abort(400)
    # documentModel
    if request.url_rule.endpoint.find('exception') >= 0:
        document_model = DocumentModel.exception
    else:
        document_model = DocumentModel.log

    ds = DocumentService()
    docs = ds.get_documents(application_id, group_tag, document_model)
    return jsonify({'items': docs})


def get_last_document(application_id=None, group_tag=None):
    """
    GET applications/<application_id>/crashes/<group_tag>
    """
    try:
        application_id = long(application_id)
    except Exception:
        return abort(400)

    ds = DocumentService()
    document = ds.get_last_document(application_id, group_tag, DocumentModel.crash)
    if document is None:
        return abort(404)

    result = document
    return jsonify({'crash': result})
