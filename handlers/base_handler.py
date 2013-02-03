
import webapp2, json
from webapp2_extras import jinja2
from webapp2_extras import sessions
import config
from models.context import *
from services.account_service import AccountService
import logging
import gae_mini_profiler
from gae_mini_profiler.templatetags import profiler_includes


def generate_csrf_token():
    session = sessions.get_store().get_session()
    return session['_csrf_token']

def jinja2_factory(app):
    j = jinja2.Jinja2(app)
    j.environment.filters.update({
        # Set filters.
        # ...
    })
    j.environment.globals.update({
        # Set global variables.
        'csrf_token' : generate_csrf_token,
        'uri_for': webapp2.uri_for,
        'getattr': getattr,
        'str': str
    })
    j.environment.tests.update({
        # Set tests.
        # ...
    })
    return j

def handle_error(request, response, exception):
    status = hasattr(exception, 'status_int') and exception.status_int or 500
    c = {
        'exception': str(exception),
        'status': status,
        'url': request.url,
        }

    if status in config.error_templates:
        template = config.error_templates[status]
    else:
        template = config.error_templates.items()[0]
    t = jinja2.get_jinja2(factory=jinja2_factory, app=webapp2.get_app()).render_template(template, **c)
    logging.error(str(status) + " - " + str(exception))
    response.write(t)
    response.set_status(status)


class BaseHandler(webapp2.RequestHandler):
    def __init__(self, request, response):
        self.initialize(request, response)
        self.view_model = {
            'title': '',
            'title_prefix': config.app_name,
            "profiler_includes": gae_mini_profiler.templatetags.profiler_includes()
        }
        self.context = context()
        self.context.request = request
        self.context.response = response
        
        # Authorization
        acs = AccountService(self.context)
        self.user = acs.authorization(str(request.cookies.get(config.cookie_auth)))
        self.context.user = self.user
        self.view_model['user'] = self.user

        # miko framework
        self.miko = 'X-Miko' in request.headers
        self.view_model['miko'] = self.miko
            # miko result
            # True: result content
            # False: result all page

        # do not redirect without login
        if self.user is None \
            and request.route.name != 'login' \
            and request.route.name != 'forgot_password' \
            and request.route.name[:4] != 'api_' \
            and request.route.name[:10] != 'task_queue':
            self.abort(302, location='/login')

    # write json to response
    def json(self, object):
        self.response.headers['Content-Type'] = "application/json"
        self.response.out.write(json.dumps(object))


    @webapp2.cached_property
    def jinja2(self):
        return jinja2.get_jinja2(factory=jinja2_factory, app=self.app)


    def render_template(self, filename, **kwargs):
        # make all self.view variables available in jinja2 templates
        if hasattr(self, 'view'):
            kwargs.update(self.view.__dict__)

        # set or overwrite special vars for jinja templates
        kwargs.update({
            'app_name': config.app_name,
            'url': self.request.url,
            'path': self.request.path,
            'query_string': self.request.query_string,
            'base_layout': config.base_layout
            })

        if hasattr(self, 'form'):
            kwargs['form'] = self.form

        self.response.write(self.jinja2.render_template(filename, **kwargs))
