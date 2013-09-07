
from application import app
from handlers.application_handler import *
from handlers.document_handler import *
from handlers import settings_handler
from handlers.web_service_handler import *



# -------- AngularJS ---------
# Applications
app.add_url_rule('/applications', 'applications', view_func=get_applications, methods=['GET'])
# Crash Documents
app.add_url_rule('/applications/<application_id>/crashes/grouped', 'application_crash_groups', view_func=get_grouped_documents, methods=['GET'])
app.add_url_rule('/applications/<application_id>/crashes/<group_tag>', 'application_crash', view_func=get_last_document, methods=['GET'])
# Exception Documents
app.add_url_rule('/applications/<application_id>/exceptions/grouped', 'application_exception_groups', view_func=get_grouped_documents, methods=['GET'])
app.add_url_rule('/applications/<application_id>/exceptions/<group_tag>', 'application_exception_groups_list', view_func=get_documents, methods=['GET'])
# Log Documents
app.add_url_rule('/applications/<application_id>/logs/grouped', 'application_log_groups', view_func=get_grouped_documents, methods=['GET'])
app.add_url_rule('/applications/<application_id>/logs/<group_tag>', 'application_log_groups_list', view_func=get_documents, methods=['GET'])

# Settings
# Applications
app.add_url_rule('/settings/applications', 'settings_applications', view_func=settings_handler.get_applications, methods=['GET'])
app.add_url_rule('/settings/applications', 'settings_applications_post', view_func=settings_handler.add_application, methods=['POST'])
app.add_url_rule('/settings/applications/<application_id>', 'settings_application_put', view_func=settings_handler.update_application, methods=['PUT'])
app.add_url_rule('/settings/applications/<application_id>', 'settings_application_delete', view_func=settings_handler.delete_application, methods=['DELETE'])
app.add_url_rule('/settings/applications/<application_id>/members', 'settings_application_invite', view_func=settings_handler.invite_user, methods=['POST'])
app.add_url_rule('/settings/applications/<application_id>/members/<member_id>', 'settings_application_member_delete', view_func=settings_handler.delete_application_member, methods=['DELETE'])
# Users
app.add_url_rule('/settings/users', 'settings_users', view_func=settings_handler.get_users, methods=['GET'])
app.add_url_rule('/settings/users', 'settings_user_post', view_func=settings_handler.add_user, methods=['POST'])
app.add_url_rule('/settings/users/<user_id>', 'settings_user_delete', view_func=settings_handler.delete_user, methods=['DELETE'])
# Profile
app.add_url_rule('/settings/profile', 'settings_profile', view_func=settings_handler.get_profile, methods=['GET'])
app.add_url_rule('/settings/profile', 'settings_profile_put', view_func=settings_handler.update_profile, methods=['PUT'])
# ---------------------------


# ----------- API -------------
app.add_url_rule('/api/v1/exception/<key>', 'api_exception', view_func=exception_document_add, methods=['POST'])
app.add_url_rule('/api/v1/exception/<key>', 'api_exception_jsonp', view_func=exception_document_add_jsonp, methods=['GET'])
app.add_url_rule('/api/v1/log/<key>', 'api_log', view_func=log_document_add, methods=['POST'])
app.add_url_rule('/api/v1/log/<key>', 'api_log_jsonp', view_func=log_document_add_jsonp, methods=['GET'])
app.add_url_rule('/api/v1/crash/<key>', 'api_crash', view_func=crash_document_add, methods=['POST'])
# ---------------------------
