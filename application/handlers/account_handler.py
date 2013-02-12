
from flask import g, redirect, render_template
from google.appengine.api import users

def LoginView():
    if g.user is not None:
        return redirect('/')

    g.view_model['title'] = 'Sign in - '
    g.view_model['login_url'] = users.create_login_url()
    return render_template('login.html', **g.view_model)