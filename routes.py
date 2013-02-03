
from webapp2_extras.routes import RedirectRoute
from handlers.account_handler import *
from handlers.settings_handler import *
from handlers.document_handler import *
from handlers.web_service_handler import *

_routes = [
    RedirectRoute('/', DocumentHandler, name='exception_group', strict_slash=True),

    # Login, Reset password
    RedirectRoute('/login', LoginHandler, name='login', strict_slash=True),
    RedirectRoute('/forgot_password', ForgotPasswordHandler, name='forgot_password', strict_slash=True),
    RedirectRoute('/users/<user_id>/reinvite', ReInviteHandler, name='re_invite', strict_slash=True),

    # Settings
    RedirectRoute('/settings', RedirectToApplicationHandler, name='settings_apps', strict_slash=True),
    RedirectRoute('/settings/profile', ProfileHandler, name='settings_profile', strict_slash=True),
    RedirectRoute('/settings/password', PasswordHandler, name='settings_password', strict_slash=True),

    # Applications
    RedirectRoute('/settings/applications', ApplicationsHandler, name='settings_apps', strict_slash=True),
    RedirectRoute('/settings/applications/<application_id>', ApplicationsHandler, name='settings_app', strict_slash=True),
    RedirectRoute('/settings/applications/<application_id>/invite', ApplicationInviteHandler, name='settings_app_invite', strict_slash=True),
    RedirectRoute('/settings/applications/<application_id>/members/<member_id>', ApplicationMemberHandler, name='settings_app_member', strict_slash=True),

    # Sessions
    RedirectRoute('/settings/sessions', SessionsHandler, name='settings_sessions', strict_slash=True),
    RedirectRoute('/settings/sessions/<session_id>', SessionsHandler, name='settings_sessions', strict_slash=True),

    # Users
    RedirectRoute('/settings/users', UsersHandler, name='settings_users', strict_slash=True),
    RedirectRoute('/settings/users/<user_id>', UsersHandler, name='settings_users', strict_slash=True),

    # Document
    RedirectRoute('/exception_groups/<application_id>/<group_tag>', DocumentHandler, name='exception_list', strict_slash=True),
    RedirectRoute('/exception_groups/<application_id>',  DocumentHandler, name='exception_group', strict_slash=True),
    RedirectRoute('/exception_groups',  DocumentHandler, name='exception_group', strict_slash=True),
    RedirectRoute('/log_groups/<application_id>/<group_tag>', DocumentHandler, name='log_list', strict_slash=True),
    RedirectRoute('/log_groups/<application_id>', DocumentHandler, name='log_group', strict_slash=True),
    RedirectRoute('/log_groups', DocumentHandler, name='log_group', strict_slash=True),

    # API
    RedirectRoute('/api/v1/exception/<key>', ExceptionDocumentHandler, name='api_exception_with_key', strict_slash=True),
    RedirectRoute('/api/v1/log/<key>', LogDocumentHandler, name='api_log_with_key', strict_slash=True),
]

def get_routes():
    return _routes

def add_routes(app):
    for r in _routes:
        app.router.add(r)
