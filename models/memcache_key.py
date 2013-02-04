
import hashlib

class MemcacheKey:
    def document_search(application_id, document_model):
        """
        Get a cache key for document groups search

        @param application_id application id
        @param document_model document type
        @returns cache key
        """
        return 'doc_search_%s_%s' % (str(application_id), str(document_model))
    document_search = staticmethod(document_search)

    def document_add(query_string, document_model):
        """
        Get a cache key for add a new document
        (cache text search document for log times

        @param query_string text search query string
        @param document_model document type
        @returns cache key
        """
        query_hash = hashlib.md5(query_string.encode('utf-8')).hexdigest()
        return 'doc_add_%s_%s' % (str(document_model), query_hash)
    document_add = staticmethod(document_add)

    def document_detail(application_id, group_tag, document_model):
        """
        Get a cache key for the first document in same group tag

        @param application_id application id
        @param group_tag document group tag
        @param document_model document type
        @returns cache key
        """
        return 'doc_detail_%s_%s_%s' % (str(application_id), str(document_model), group_tag)
    document_detail = staticmethod(document_detail)