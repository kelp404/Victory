
from flask import g, redirect, render_template

def login_page():
    if g.user is not None:
        return redirect('/')

    g.view_model['title'] = 'Sign in - '
    return render_template('login.html', **g.view_model)