
# python
import os, re, hashlib
from datetime import datetime

# flask
from flask import request

# google
from google.appengine.api import search
from google.appengine.api import memcache

# victory
from ..models.datastore.exception_model import *
from ..models.datastore.log_model import *
from ..models.datastore.crash_model import *
from ..models.key.memcache_key import *
from base_service import *
from application_service import *
from application.utilities.dict_mapping import *
from application import config



class DocumentService(BaseService):
    def get_grouped_documents(self, application_id, keyword, index, document_model):
        """
        Get document groups by application id, search keyword and index

        :param application_id: application id
        :param keyword: search keywords
        :param index: pager index
        :param document_model: document type
        :returns: [document_group], total / [], 0
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
        query_string = ''
        if keyword and len(keyword.strip()) > 0:
            source = [item for item in keyword.split(' ') if len(item) > 0]
            plus = [item for item in source if item.find('-') != 0]
            minus = [item[1:] for item in source if item.find('-') == 0 and len(item) > 1]

            if len(plus) > 0:
                keyword = ' '.join(plus)
                query_string = '(name:{1}) OR (email:{1}) OR (description:{1}) OR (ip:{1}) OR (title:{1}) OR (status:{1})'.replace('{1}', keyword)
            if len(minus) > 0:
                keyword = ' '.join(minus)
                query_string = 'NOT ((name:{1}) OR (email:{1}) OR (description:{1}) OR (ip:{1}) OR (title:{1}) OR (status:{1}))'.replace('{1}', keyword)
        cache_key = MemcacheKey.document_search(application_id, document_model)
        cache_value = memcache.get(key=cache_key)
        if cache_value and keyword + str(index) in cache_value:
            # return from cache
            return cache_value[keyword + str(index)]['result'], cache_value[keyword + str(index)]['count']

        create_time_desc = search.SortExpression(
            expression = 'create_time',
            direction = search.SortExpression.DESCENDING,
            default_value = 0)
        options = search.QueryOptions(
            offset = config.page_size * index,
            limit = config.page_size,
            sort_options = search.SortOptions(expressions=[create_time_desc], limit=1000),
            returned_fields = ['title', 'name', 'times', 'description', 'email', 'create_time'])
        query = search.Query(query_string=query_string, options=options)
        try:
            if document_model == DocumentModel.exception:
                # search data from ExceptionModel
                documents = search.Index(namespace='ExceptionModel', name=str(application_id)).search(query)
            elif document_model == DocumentModel.log:
                # search data from LogModel
                documents = search.Index(namespace='LogModel', name=str(application_id)).search(query)
            else:
                # search data from CrashModel
                documents = search.Index(namespace='CrashModel', name=str(application_id)).search(query)
        except:
            # schema missing
            return [], 0

        for document in documents:
            result.append({'group_tag': document.doc_id,
                           'title': document.field('title').value,
                           'name': document.field('name').value,
                           'times': int(document.field('times').value),
                           'description': document.field('description').value,
                           'email': document.field('email').value,
                           'create_time': document.field('create_time').value.strftime('%Y-%m-%dT%H:%M:%S.%fZ')})

        # if number of documents over maximum then return the maximum
        if documents.number_found > 1000 + config.page_size:
            count = 1000 + config.page_size
        else:
            count = documents.number_found

        # set memory cache for 12 hours
        if cache_value is None:
            cache_value = {keyword + str(index): {'result': result, 'count': count}}
            memcache.set(key=cache_key, value=cache_value, time=43200)
        else:
            cache_value[keyword + str(index)] = {'result': result, 'count': count}
            memcache.set(key=cache_key, value=cache_value, time=43200)

        return result, count

    def get_documents(self, application_id, group_tag, document_model):
        """
        Get documents with application id and group tag

        :param application_id: application id
        :param group_tag: group tag
        :param document_model: document type (ExceptionModel / LogModel)
        :return: [document] / []
        """
        try:
            application_id = long(application_id)
        except Exception:
            return abort(400)
        if group_tag is None: return abort(400)
        # check auth
        aps = ApplicationService()
        if not aps.is_my_application(application_id):
            return abort(403)

        if document_model == DocumentModel.exception:
            documents = ExceptionModel().gql('where group_tag = :1 order by create_time DESC limit 100', group_tag)
        elif document_model == DocumentModel.log:
            documents = LogModel().gql('where group_tag = :1 order by create_time DESC limit 100', group_tag)
        else:
            documents = CrashModel().gql('where group_tag = :1 order by create_time DESC limit 100', group_tag)

        result = []
        for document in documents.fetch(100):
            result.append(document.dict())

        return result

    def get_last_document(self, application_id, group_tag, document_model):
        """
        Get the last document with application id and group tag
        (result maybe from cache

        :param application_id: application id
        :param group_tag: group tag
        :param document_model: document type
        :return: document
        """
        try:
            application_id = long(application_id)
        except:
            return abort(400)
        if group_tag is None:
            return abort(404)

        # check auth
        aps = ApplicationService()
        if not aps.is_my_application(application_id):
            return abort(403)

        cache_key = MemcacheKey.document_detail(application_id, group_tag, document_model)
        cache_value = memcache.get(key=cache_key)
        if cache_value:
            # return data from cache
            return cache_value

        if document_model == DocumentModel.exception:
            documents = ExceptionModel().gql('where group_tag = :1 order by create_time DESC limit 1', group_tag)
        elif document_model == DocumentModel.log:
            documents = LogModel().gql('where group_tag = :1 order by create_time DESC limit 1', group_tag)
        else:
            documents = CrashModel().gql('where group_tag = :1 order by create_time DESC limit 1', group_tag)

        for document in documents.fetch(1):
            cache_value = document.dict()
            # 18000 = 5 hours
            memcache.set(key=cache_key, value=cache_value, time=18000)
            return cache_value

        return abort(404)

    def add_document(self, key, document, document_model):
        """
        Add a document for web service

        :param key: application key
        :param document: log content
        :param document_model: document type
        :returns: True, None / False, error message
        """
        if key is None: return False, 'key is required'
        if document_model is DocumentModel.crash:
            user = document.get('user')
            if user is None:
                return False, 'user is missing'
            if user.get('name') is None:
                return False, 'user.name is required'
        else:
            if document.get('title') is None:
                return False, 'title is required'
            if document.get('name') is None:
                return False, 'name is required'

        # check application is exist
        applications = db.GqlQuery('select * from ApplicationModel where app_key = :1 limit 1', key)
        if applications.count(1) is 0:
            return False, 'no match application'
        application = applications[0]

        # select data store
        if document_model is DocumentModel.exception:
            # add a exception document
            model = ExceptionModel()
        elif document_model is DocumentModel.log:
            # add a log document
            model = LogModel()
        else:
            # add a crash document
            model = CrashModel()

        # fixed input value
        if document_model is DocumentModel.crash:
            model.report = document
            model.title = ['0x%s %s %s' % (('00000000' + (hex(x['backtrace']['contents'][0]['instruction_addr'])[2:]))[-8:], x['backtrace']['contents'][0]['object_name'], x['backtrace']['contents'][0]['symbol_name']) for x in document['crash']['threads'] if x['crashed']][0]
            # set user info
            user = document['user']
            model.name = user['name']
            model.email = user.get('email')
            model.access_token = user.get('access_token')
            # set create_time
            try: model.create_time = datetime.strptime(document['report']['timestamp'], '%Y-%m-%dT%H:%M:%SZ')
            except: model.create_time = datetime.now()
            # set app uuid
            model.app_uuid = document['system'].get('app_uuid')
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
            DictMapping.inject(model, document)
            model.create_time = datetime.now()
            if model.parameters:
                # remove password=\w*&
                model.parameters = re.sub(r'password=([^&])*&', '', model.parameters, flags=re.IGNORECASE)
            # set create_time
            if document.get('create_time') is not None:
                try: model.create_time = datetime.strptime(document['create_time'], '%Y-%m-%dT%H:%M:%S')
                except:
                    try: model.create_time = datetime.strptime(document['create_time'], '%Y-%m-%dT%H:%M')
                    except:
                        try: model.create_time = datetime.strptime(document['create_time'], '%Y-%m-%dT%H:%M:%SZ')
                        except: pass

        model.app_id = application.key().id()
        model.ip = os.environ["REMOTE_ADDR"]
        if 'User-Agent' in request.headers:
            model.user_agent = request.headers['User-Agent']
        # group tag is sha1({ app_id }_{ title }_{ name }_{ create_time(yyyy-MM-dd) })
        group_tag = '%s_%s_%s_%s' % (model.app_id, model.title, model.name, model.create_time.strftime('%Y-%m-%d'))
        model.group_tag = hashlib.sha1(group_tag.encode('utf-8')).hexdigest()
        model.put()

        # clear memory cache for document search
        memcache.delete(MemcacheKey.document_search(model.app_id, document_model))

        # post document to text search
        # text search schema name is same with data store name
        if document_model is DocumentModel.exception:
            text_search_namespace = 'ExceptionModel'
        elif document_model is DocumentModel.log:
            text_search_namespace = 'LogModel'
        else:
            text_search_namespace = 'CrashModel'
        index = search.Index(namespace=text_search_namespace, name=str(application.key().id()))

        # update times field
        cache_key = MemcacheKey.document_add(model.app_id, model.group_tag, document_model)
        times = memcache.incr(key=cache_key, initial_value=0)

        # insert to text search
        search_document = search.Document(doc_id=model.group_tag,
                                          fields=[search.TextField(name='description', value=model.description),
                                           search.TextField(name='email', value=model.email),
                                           search.TextField(name='name', value=model.name),
                                           search.TextField(name='title', value=model.title),
                                           search.TextField(name='ip', value=model.ip),
                                           search.NumberField(name='times', value=times),
                                           search.DateField(name='create_time', value=model.create_time)])
        index.put(search_document)
        db.Model().get(model.key()) # sync

        return True, None
