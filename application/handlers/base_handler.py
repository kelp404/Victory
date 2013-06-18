# -*- coding: utf-8 -*-


# python
import sys
import traceback

# flask
from flask import render_template, g, request, redirect

# google
from google.appengine.api import users

# victory
from application import app, config
from application.services.account_service import *

import gae_mini_profiler
from gae_mini_profiler.templatetags import profiler_includes



@app.before_request
def before_request():
    g.view_model = {
        'compressed': config.compressed_resource,
        'profiler_includes': gae_mini_profiler.templatetags.profiler_includes(),
        'title': '',
        'title_prefix': config.app_name
    }
    # Authorization
    acs = AccountService()
    g.user = acs.authorization()
    g.view_model['user'] = g.user
    if g.user:
        g.view_model['logout_url'] = users.create_logout_url('/')
    else:
        g.view_model['login_url'] = users.create_login_url()

    # miko framework
    # miko result
    # True: result content
    # False: result all page
    g.view_model['miko'] = 'X-Miko' in request.headers

    # do not redirect without login
    if request.url_rule is not None and g.user is None \
        and request.url_rule.endpoint != 'login' \
        and request.url_rule.endpoint[:4] != 'api_':
        return redirect('/login')


@app.errorhandler(404)
def error_404(e):
    return render_template('/error/default.html', status=404, exception=e), 404

@app.errorhandler(405)
def error_405(e):
    return render_template('/error/default.html', status=405, exception=e), 405

@app.errorhandler(500)
def error_500(e):
    return render_template('./error/default.html', status=500, exception=e), 500
def handle_exception(e):
    traceback.print_exc(3, file=sys.stdout)
    description = e if config.DEBUG else u'（˚ Д ˚ ）'
    return render_template('./error/default.html', status=500, exception=description), 500
app.handle_exception = handle_exception

@app.errorhandler(503)
def error_503(e):
    return render_template('/error/default.html', status=503, exception=e), 503
