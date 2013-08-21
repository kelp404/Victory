
# flask
from flask import g, redirect, render_template, jsonify

# application
from application.models.datastore.user_model import *
from application.models.angular_model.user_angular_model import *



def login_page():
    if g.user is not None:
        return redirect('/')

    g.view_model['title'] = 'Sign in - '
    return render_template('login.html', **g.view_model)

def get_user_profile():
    if g.user:
        user = UserAngularModel(True, g.user.key().id(), g.user.level == UserLevel.root, g.user.name, g.user.email)
    else:
        user = UserAngularModel(False)
    return jsonify(user.__dict__)
