
# flask
from flask import g, jsonify

# application
from application.models.datastore.user_model import *
from application.models.angular_model.user_angular_model import *



def get_user_profile():
    if g.user:
        user = UserAngularModel(True, g.user.key().id(), g.user.level == UserLevel.root, g.user.name, g.user.email)
    else:
        user = UserAngularModel(False)
    return jsonify(user.__dict__)
