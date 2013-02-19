

from flask import redirect, render_template, jsonify, request
from application.services.account_service import AccountService
from application.services.application_service import *


def redirect_to_application():
    """
    302: /settings/applications
    """
    return redirect('/settings/applications')


def profile():
    """
    GET: settings/profile
    get profile
    """
    g.view_model['title'] = 'Profile - '
    return render_template('settings_profile.html', **g.view_model)

def profile_update():
    """
    PUT: settings/profile
    update profile
    """
    name = request.form.get('name')
    acs = AccountService()
    success, result_name = acs.update_profile(name)
    return jsonify({ 'success': success, 'name': result_name })


def applications():
    """
    GET: settings/applications
    get applications list
    """
    g.view_model['title'] = 'Applications - '

    aps = ApplicationService()
    g.view_model['result'] = aps.get_applications(True)
    return render_template('settings_applications.html', **g.view_model)

def application_add():
    """
    POST: settings/applications
    add an application
    """
    name = request.form.get('name')
    description = request.form.get('description')
    aps = ApplicationService()
    return jsonify({ 'success': aps.add_application(name, description) })

def application_update(application_id):
    """
    PUT: settings/applications/<application_id>
    update the application
    """
    try: application_id = long(application_id)
    except: return jsonify({ 'success': False })

    name = request.form.get('name')
    description = request.form.get('description')
    aps = ApplicationService()
    return jsonify({ 'success': aps.update_application(application_id, name, description) })

def application_delete(application_id):
    """
    DELETE: settings/applications/<application_id>
    delete the application
    """
    aps = ApplicationService()
    return jsonify({ 'success': aps.delete_application(application_id) })

def application_invite(application_id):
    """
    POST: settings/application/<application_id>/invite
    invite user to join the application
    """
    email = request.form.get('email')
    try: application_id = long(application_id)
    except: return jsonify({ 'success': False })

    acs = AccountService()
    aps = ApplicationService()

    # am I owner?
    if not aps.is_my_application(application_id, True):
        return jsonify({ 'success': False })

    # invite user
    user = acs.invite_user(email)
    if user is None:
        return jsonify({ 'success': False })

    # add the new user to the application
    success = aps.add_user_to_application(user.key().id(), application_id)

    return jsonify({ 'success': success })

def application_member_delete(application_id, member_id):
    """
    DELETE: settings/applications/<application_id>/members/<member_id>
    delete a member in the application
    """
    try: application_id = long(application_id)
    except: return jsonify({ 'success': False })
    try: member_id = long(member_id)
    except: return jsonify({ 'success': False })

    aps = ApplicationService()
    return jsonify({ 'success': aps.delete_user_from_application(member_id, application_id) })


def users():
    """
    GET: settings/users
    get users list
    """
    acs = AccountService()
    g.view_model['result'] = acs.get_users()

    return render_template('settings_users.html', **g.view_model)

def user_add():
    """
    POST: settings/users
    add an user
    """
    email = request.form.get('email')
    acs = AccountService()
    return jsonify({ 'success': acs.invite_user(email) is not None })

def user_delete(user_id):
    """
    DELETE: settings/users/<user_id>
    delete the user
    """
    acs = AccountService()
    return jsonify({ 'success': acs.delete_user(user_id) })
