# flask
from flask import g, abort

# application
from application.models.datastore.user_model import *



def authorization(level):
    """
    Authorization decorator.
    :param level: UserLevel
    """
    def decorator(f):
        def wraps(*args, **kwargs):
            # root
            if level == UserLevel.root:
                if g.user is None or g.user.level != UserLevel.root:
                    return abort(403)
            # normal
            elif level == UserLevel.normal:
                if g.user is None:
                    return abort(403)

            return f(*args, **kwargs)
        return wraps

    return decorator