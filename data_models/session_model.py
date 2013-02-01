
from google.appengine.ext import db


class SessionModel(db.Model):
    user_id = db.IntegerProperty()
    cookie = db.StringProperty()
    user_agent = db.TextProperty()
    ip = db.TextProperty()
    create_time = db.DateTimeProperty(auto_now_add=True)

