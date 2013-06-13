

class MemcacheKey:
    @staticmethod
    def document_search(application_id, document_model):
        """
        Get a cache key for document groups search

        @param application_id application id
        @param document_model document type
        @returns cache key
        """
        return 'doc_search_%s_%s' % (str(application_id), str(document_model))

    @staticmethod
    def document_add(app_id, group_tag, document_model):
        """
        Get a cache key for add a new document

        @param app_id application id
        @param group_tag document's group_tag
        @param document_model document type
        @returns cache key
        """
        return 'doc_add_%s_%s_%s' % (str(app_id), str(document_model), group_tag)

    @staticmethod
    def document_detail(application_id, group_tag, document_model):
        """
        Get a cache key for the first document in same group tag

        @param application_id application id
        @param group_tag document group tag
        @param document_model document type
        @returns cache key
        """
        return 'doc_detail_%s_%s_%s' % (str(application_id), str(document_model), group_tag)