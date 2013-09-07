
# flask
from flask import jsonify

# application
from application.decorator.auth_decorator import *
from application.services.application_service import *



@authorization(UserLevel.normal)
def get_applications():
    """
    GET: applications
    get applications
    """
    aps = ApplicationService()
    apps = aps.get_applications()
    return jsonify({'items': apps})
