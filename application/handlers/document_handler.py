
from application.services.document_service import *
import config
from flask import request, render_template, g, abort


def DocumentView(application_id=None, group_tag=None):
    try: index = int(request.args.get('index'))
    except: index = 0
    try: application_id = long(application_id)
    except: application_id = 0
    keyword = request.args.get('q')
    if keyword is None: keyword = ''
    g.view_model['keyword'] = keyword

    # document type
    if request.url_rule.endpoint[:10] == 'exception_':
        document_model = DocumentModel.exception
        g.view_model['document_model'] = 'exception'
        g.view_model['title'] = 'Handled Exceptions - '
    elif request.url_rule.endpoint[:4] == 'log_':
        document_model = DocumentModel.log
        g.view_model['document_model'] = 'log'
        g.view_model['title'] = 'Logs - '
    else:
        document_model = DocumentModel.crash
        g.view_model['document_model'] = 'crash'
        g.view_model['title'] = 'Crashes  - '

    # get applications
    aps = ApplicationService()
    applications = aps.get_applications()
    g.view_model['applications'] = applications

    if application_id == 0:
        # input value has no application id
        if len(applications) > 0:
            # result a default application
            application_id = applications[0]['id']
            g.view_model['selected_application'] = applications[0]['name']
            g.view_model['application_id'] = application_id
        else:
            # no input value and no applications
            g.view_model['page'] = { 'items': [], 'total': 0, 'index': index, 'size': config.page_size, 'max': 0 }
            g.view_model['documents'] = []
            return render_template('document_groups.html', **g.view_model)
    else:
        select_application = [x for x in applications if x['id'] == application_id]
        if select_application:
            # input value in application list
            g.view_model['selected_application'] = select_application[0]['name']
            g.view_model['application_id'] = application_id
        else:
            # selected id is not in owner applications
            abort(404)

    ds = DocumentService()
    if group_tag is None:
        # get document groups of the application
        result, total = ds.get_document_groups(application_id, keyword, index, document_model)
        g.view_model['page'] = {
            'items': result,
            'total': total,
            'index': index,
            'size': config.page_size,
            'max': (total - 1) / config.page_size
        }
        if document_model != DocumentModel.crash:
            documents = []
            for item in result:
                if item['times'] == 1:
                    document = ds.get_last_document(application_id, item['group_tag'], document_model)
                    if document: documents.append(document)
            g.view_model['documents'] = documents

        return render_template('document_groups.html', **g.view_model)
    else:
        if document_model == DocumentModel.crash:
            # get crash document
            result = ds.get_last_document(application_id, group_tag, document_model)
            if result is None: abort(404)
            g.view_model['result'] = result
            g.view_model['crashed_threads'] = [thread for thread in result['report']['crash']['threads'] if thread['crashed']]
            g.view_model['threads'] = [thread for thread in result['report']['crash']['threads'] if not thread['crashed']]
            for thread in g.view_model['crashed_threads']:
                if 'backtrace' in thread:
                    for x in thread['backtrace']['contents']:
                        x['instruction_addr_hex'] = '0x' + ('00000000' + hex(x['instruction_addr'])[2:])[-8:]
            for thread in g.view_model['threads']:
                if 'backtrace' in thread:
                    for x in thread['backtrace']['contents']:
                        x['instruction_addr_hex'] = '0x' + ('00000000' + hex(x['instruction_addr'])[2:])[-8:]
            return render_template('document_crash.html', **g.view_model)
        else:
            # get exception or log documents
            result = ds.get_documents(application_id, group_tag, document_model)
            if len(result) == 0: abort(404)
            g.view_model['result'] = result
            return render_template('documents.html', **g.view_model)
