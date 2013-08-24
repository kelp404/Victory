
# python
import json

# flask
from flask import render_template, jsonify, request, abort

# victory
from base_handler import validated_failed
from application.decorator.auth_decorator import *
from application.models.form.application_form import *
from application.services.account_service import *
from application.services.application_service import *



@authorization(UserLevel.normal)
def profile():
    """
    GET: settings/profile
    get profile
    """
    g.view_model['title'] = 'Profile - '
    return render_template('./settings/profile.html', **g.view_model)

@authorization(UserLevel.normal)
def profile_update():
    """
    PUT: settings/profile
    update profile
    """
    name = request.form.get('name')
    acs = AccountService()
    success, result_name = acs.update_profile(name)
    if success:
        return jsonify({ 'success': success, 'name': result_name })
    else:
        return abort(417)


@authorization(UserLevel.normal)
def get_applications():
    """
    GET: settings/applications
    get applications list
    """
    aps = ApplicationService()
    result = aps.get_applications(True)
    return jsonify({'items': result})

@authorization(UserLevel.normal)
def add_application():
    """
    POST: settings/applications
    add an application
    """
    ap = ApplicationForm(**json.loads(request.data))
    if not ap.validate():
        return validated_failed(**ap.validated_messages())

    aps = ApplicationService()
    aps.add_application(ap.name.data, ap.description.data)
    return jsonify({'success': True})

@authorization(UserLevel.normal)
def application_update(application_id):
    """
    PUT: settings/applications/<application_id>
    update the application
    """
    # check input
    try: application_id = long(application_id)
    except: return abort(400)

    name = request.form.get('name')
    description = request.form.get('description')
    aps = ApplicationService()
    success = aps.update_application(application_id, name, description)
    if success:
        return jsonify({'success': success})
    else:
        return abort(417)

@authorization(UserLevel.normal)
def application_delete(application_id):
    """
    DELETE: settings/applications/<application_id>
    delete the application
    """
    try: application_id = long(application_id)
    except: return abort(400)

    aps = ApplicationService()
    success = aps.delete_application(application_id)
    if success:
        return jsonify({'success': success})
    else:
        return abort(417)

@authorization(UserLevel.normal)
def application_invite(application_id):
    """
    POST: settings/application/<application_id>/invite
    invite user to join the application
    """
    try: application_id = long(application_id)
    except: return abort(400)
    email = request.form.get('email')

    acs = AccountService()
    aps = ApplicationService()

    # am I owner?
    if not aps.is_my_application(application_id, True):
        return abort(403)

    # invite user
    user = acs.invite_user(email)
    if user is None:
        return abort(417)

    # add the new user to the application
    success = aps.add_user_to_application(user.key().id(), application_id)
    if success:
        return jsonify({ 'success': success })
    else:
        return abort(417)

@authorization(UserLevel.normal)
def application_member_delete(application_id, member_id):
    """
    DELETE: settings/applications/<application_id>/members/<member_id>
    delete a member in the application
    """
    try:
        application_id = long(application_id)
        member_id = long(member_id)
    except:
        return abort(400)

    aps = ApplicationService()
    success = aps.delete_user_from_application(member_id, application_id)
    if success:
        return jsonify({'success': success})
    else:
        return abort(417)


@authorization(UserLevel.root)
def users():
    """
    GET: settings/users
    get users list
    """
    acs = AccountService()
    g.view_model['result'] = acs.get_users()

    return render_template('./settings/users.html', **g.view_model)

@authorization(UserLevel.root)
def user_add():
    """
    POST: settings/users
    add an user
    """
    email = request.form.get('email')
    acs = AccountService()
    user = acs.invite_user(email)
    if user:
        return users()
    else:
        return abort(417)

@authorization(UserLevel.root)
def user_delete(user_id):
    """
    DELETE: settings/users/<user_id>
    delete the user
    """
    acs = AccountService()
    success = acs.delete_user(user_id)
    if success:
        return jsonify({'success': success})
    else:
        return abort(417)
