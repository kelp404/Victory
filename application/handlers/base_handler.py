# -*- coding: utf-8 -*-


# python
import sys
import traceback

# flask
from flask import render_template, g, request, redirect, abort, jsonify, make_response

# google
from google.appengine.api import users

# victory
from application import app, config
from application.services.account_service import *



@app.route('/_ah/start', methods=['GET'])
def start_handler():
    return abort(404)


@app.before_request
def before_request():
    if not app.debug and request.scheme == 'http':
        # redirect to https
        return redirect('https' + request.url[4:])

    g.view_model = {
        'compressed': config.compressed_resource,
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


@app.route('/')
def index():
    """
    AngularJS base html.
    :return: flask.response
    """
    return render_template('base.html', **g.view_model)


def validated_failed(**kwargs):
    """
    Return validated failed message with json.
    :param kwargs: validated failed messages
    :return: flask.response
    """
    response = jsonify(kwargs)
    response.status_code = 400
    return response

def success(status_code=204):
    """
    Return successful status code. Default is return 204.
    :param status_code: 200 > ok, 201 > created, 204 > no content
    :return: flask.response
    """
    response = make_response()
    response.status_code = status_code
    return response

def json_redirect(location):
    """
    Return json redirect content.
    :param location: redirect target url
    :return: flask.response
    """
    result = {'__status__': 302, 'location': location}
    return jsonify(result)


@app.errorhandler(400)
def error_400(e):
    return render_template('error.html', status=400, exception=e), 400

@app.errorhandler(403)
def error_403(e):
    if g.user is None:
        return json_redirect('#/login')
    else:
        return render_template('error.html', status=403, exception=e), 403

@app.errorhandler(404)
def error_404(e):
    return render_template('error.html', status=404, exception=e), 404

@app.errorhandler(405)
def error_405(e):
    return render_template('error.html', status=405, exception=e), 405

@app.errorhandler(417)
def error_417(e):
    return render_template('error.html', status=417, exception=e), 417

@app.errorhandler(500)
def error_500(e):
    return render_template('error.html', status=500, exception=e), 500
def handle_exception(e):
    traceback.print_exc(10, file=sys.stdout)
    description = e if app.debug else u'（˚ Д ˚ ）'
    return render_template('error.html', status=500, exception=description), 500
app.handle_exception = handle_exception

@app.errorhandler(503)
def error_503(e):
    return render_template('error.html', status=503, exception=e), 503
