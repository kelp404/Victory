
from flask import request
from application.data_models.exception_model import *
from application.data_models.log_model import *
from application.data_models.crash_model import *
from application.services.base_service import *
from application.services.application_service import *
from application.utilities.value_injector import *
from google.appengine.api import search
from application.models.memcache_key import *
from google.appengine.api import memcache
import os, re, datetime, hashlib
import config
import logging

class DocumentService(BaseService):
    def get_document_groups(self, application_id, keyword, index, document_model):
        """
        Get document groups by application id, search keyword and index

        @param application_id application id
        @param keyword search keywords
        @param index pager index
        @param document_model document type
        @returns [document_group], total / [], 0
        """
        if index is None: index = 0
        try:
            application_id = long(application_id)
            index = int(index)
        except: return [], 0

        # check auth
        aps = ApplicationService()
        if not aps.is_my_application(application_id):
            return [], 0

        result = []
        try:
            query_string = '(app_id:%s)' % application_id
            if keyword and len(keyword.strip()) > 0:
                source = [item for item in keyword.split(' ') if len(item) > 0]
                plus = [item for item in source if item.find('-') != 0]
                minus = [item[1:] for item in source if item.find('-') == 0 and len(item) > 1]

                if len(plus) > 0:
                    keyword = ' '.join(plus)
                    query_string = query_string + ' AND ((name:{1}) OR (email:{1}) OR (description:{1}) OR (ip:{1}) OR (title:{1}) OR (status:{1}))'.replace('{1}', keyword)
                if len(minus) > 0:
                    keyword = ' '.join(minus)
                    query_string = query_string + ' AND NOT ((name:{1}) OR (email:{1}) OR (description:{1}) OR (ip:{1}) OR (title:{1}) OR (status:{1}))'.replace('{1}', keyword)
            cache_key = MemcacheKey.document_search(application_id, document_model)
            cache_value = memcache.get(key=cache_key)
            if cache_value and keyword + str(index) in cache_value:
                # return from cache
                return cache_value[keyword + str(index)]['result'], cache_value[keyword + str(index)]['count']

            create_time_desc = search.SortExpression(
                expression = 'create_time',
                direction = search.SortExpression.DESCENDING,
                default_value = '0')
            options = search.QueryOptions(
                offset = config.page_size * index,
                limit = config.page_size,
                sort_options = search.SortOptions(expressions=[create_time_desc]),
                returned_fields = ['title', 'name', 'times', 'description', 'email', 'create_time', 'group_tag'])
            query = search.Query(query_string, options=options)
            if document_model == DocumentModel.exception:
                # search data from ExceptionModel
                documents = search.Index(name='ExceptionModel').search(query)
            elif document_model == DocumentModel.log:
                # search data from LogModel
                documents = search.Index(name='LogModel').search(query)
            else:
                # search data from CrashModel
                documents = search.Index(name='CrashModel').search(query)

            for document in documents:
                result.append({'group_tag': document.field('group_tag').value,
                               'title': document.field('title').value,
                               'name': document.field('name').value,
                               'times': int(document.field('times').value),
                               'description': document.field('description').value,
                               'email': document.field('email').value,
                               'create_time': document.field('create_time').value.strftime('%Y-%m-%dT%H:%M:%S.%fZ')})

        except:
            return [], 0

        # if number of documents over maximum then return the maximum
        if documents.number_found > 1000 + config.page_size:
            count = 1000 + config.page_size
        else:
            count = documents.number_found

        # set memory cache for 12 hours
        if cache_value is None:
            cache_value = { keyword + str(index): { 'result': result, 'count': count } }
            memcache.set(key=cache_key, value=cache_value, time=43200)
        else:
            cache_value[keyword + str(index)] = { 'result': result, 'count': count }
            memcache.set(key=cache_key, value=cache_value, time=43200)

        return result, count

    def get_documents(self, application_id, group_tag, document_model):
        """
        Get documents with application id and group tag

        @param application_id application id
        @param group_tag group tag md5({ title }_{ name }_{ create_time(yyyy-MM-dd) })
        @param document_model document type (ExceptionModel / LogModel)
        @returns [document] / []
        """
        try: application_id = long(application_id)
        except: return []
        if group_tag is None: return []
        # check auth
        aps = ApplicationService()
        if not aps.is_my_application(application_id):
            return []

        if document_model == DocumentModel.exception:
            documents = db.GqlQuery('select * from ExceptionModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 100', application_id, group_tag)
        elif document_model == DocumentModel.log:
            documents = db.GqlQuery('select * from LogModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 100', application_id, group_tag)
        else:
            documents = db.GqlQuery('select * from CrashModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 100', application_id, group_tag)

        result = []
        for document in documents.fetch(100):
            result.append(document.dict())

        return result

    def get_last_document(self, application_id, group_tag, document_model):
        """
        Get the last document with application id and group tag
        (result maybe from cache

        @param application_id application id
        @param group_tag group tag md5({ title }_{ name }_{ create_time(yyyy-MM-dd) })
        @param document_model document type
        @returns document / None
        """
        try: application_id = long(application_id)
        except: return None
        if group_tag is None: return None

        # check auth
        aps = ApplicationService()
        if not aps.is_my_application(application_id):
            return None

        cache_key = MemcacheKey.document_detail(application_id, group_tag, DocumentModel.exception)
        cache_value = memcache.get(key=cache_key)
        if cache_value: return cache_value  # return data from cache
        if document_model == DocumentModel.exception:
            documents = db.GqlQuery('select * from ExceptionModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 1', application_id, group_tag)
        elif document_model == DocumentModel.log:
            documents = db.GqlQuery('select * from LogModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 1', application_id, group_tag)
        else:
            documents = db.GqlQuery('select * from CrashModel where app_id = :1 and group_tag = :2 order by create_time DESC limit 1', application_id, group_tag)

        for document in documents.fetch(1):
            cache_value = document.dict()
            # 18000 = 5 hours
            memcache.set(key=cache_key, value=cache_value, time=18000)
            return cache_value

        return None

    def add_document(self, key, document, document_model):
        """
        Add a document for web service

        @param key application key
        @param document log content
        @param document_model document type
        @returns True, None / False, error message
        """
        if key is None: return False, 'key is required'
        if document_model != DocumentModel.crash:
            if 'title' not in document or document['title'] is None: return False, 'title is required'
            if 'name' not in document or document['name'] is None: return False, 'name is required'

        # check application is exist
        applications = db.GqlQuery('select * from ApplicationModel where app_key = :1 limit 1', key)
        if applications.count(1) == 0:
            return False, 'no match application'

        # select data store
        if document_model == DocumentModel.exception:
            # add a exception document
            model = ExceptionModel()
        elif document_model == DocumentModel.log:
            # add a log document
            model = LogModel()
        else:
            # add a crash document
            model = CrashModel()

        # fixed input value
        if document_model == DocumentModel.crash:
            model.report = document
            model.title = ['0x%s %s %s' % (('00000000' + (hex(x['backtrace']['contents'][0]['instruction_addr'])[2:]))[-8:], x['backtrace']['contents'][0]['object_name'], x['backtrace']['contents'][0]['symbol_name']) for x in document['crash']['threads'] if x['crashed']][0]
            model.name = document['user']['name']
            # set user info
            try: model.email = document['user']['email']
            except: pass
            try: model.access_token = document['user']['access_token']
            except: pass
            # set create_time
            try: model.create_time = datetime.datetime.strptime(document['report']['timestamp'], '%Y-%m-%dT%H:%M:%SZ')
            except: model.create_time = datetime.datetime.now()
            # set app uuid
            model.app_uuid = document['system']['app_uuid']
            # set version
            try: model.version = '%s (%s)' % (document['system']['CFBundleShortVersionString'], document['system']['CFBundleVersion'])
            except: pass
            # set os version
            try: model.os_version = document['system']['system_version']
            except: pass
            # set device
            try: model.device = document['system']['machine']
            except: pass
        else:
            ValueInjector.inject(model, document)
            model.create_time = datetime.datetime.now()
            if model.parameters:
                # remove password=\w*&
                model.parameters = re.sub(r'password=([^&])*&', '', model.parameters, flags=re.IGNORECASE)
            # set status
            if 'status' in document and model.status is None: model.status = str(document['status'])
            # set create_time
            if 'create_time' in document and document['create_time']:
                try: model.create_time = datetime.datetime.strptime(document['create_time'], '%Y-%m-%dT%H:%M:%S')
                except:
                    try: model.create_time = datetime.datetime.strptime(document['create_time'], '%Y-%m-%dT%H:%M')
                    except: pass

        model.app_id = applications[0].key().id()
        model.ip = os.environ["REMOTE_ADDR"]
        if 'User-Agent' in request.headers:
            model.user_agent = request.headers['User-Agent']
        # group ta is md5({ title }_{ name }_{ create_time(yyyy-MM-dd) })
        group_tag = '%s_%s_%s' % (model.title, model.name, model.create_time.strftime('%Y-%m-%d'))
        model.group_tag = hashlib.md5(group_tag.encode('utf-8')).hexdigest()
        model.put()

        # clear memory cache for document search
        memcache.delete(MemcacheKey.document_search(model.app_id, document_model))

        # post document to text search
        if document_model == DocumentModel.exception:
            text_search_name = 'ExceptionModel'
        elif document_model == DocumentModel.log:
            text_search_name = 'LogModel'
        else:
            text_search_name = 'CrashModel'
        index = search.Index(name=text_search_name)

        # update times field
        memcache.incr(key=MemcacheKey.document_add(model.app_id, model.group_tag, document_model), initial_value=0)
        times = memcache.get(MemcacheKey.document_add(model.app_id, model.group_tag, document_model))

        # delete text search document group_tag of that are same
        options = search.QueryOptions(returned_fields = [])
        query_string = 'app_id=%s AND group_tag=%s' % (model.app_id, model.group_tag)
        query = search.Query(query_string=query_string, options=options)
        items = index.search(query)
        if items.number_found > 0:
            index.delete([x.doc_id for x in items])

        # insert to text search
        search_document = search.Document(fields=[search.TextField(name='group_tag', value=model.group_tag),
                                           search.NumberField(name='app_id', value=model.app_id),
                                           search.TextField(name='description', value=model.description),
                                           search.TextField(name='email', value=model.email),
                                           search.TextField(name='name', value=model.name),
                                           search.TextField(name='title', value=model.title),
                                           search.TextField(name='ip', value=model.ip),
                                           search.NumberField(name='times', value=times),
                                           search.DateField(name='create_time', value=model.create_time)])
        index.put(search_document)

        return True, None
