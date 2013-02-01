
from google.appengine.ext import db

class UserLevel(object):
    root = 0
    pending = 1
    normal = 2

class UserModel(db.Model):
    email = db.StringProperty()
    name = db.TextProperty()
    level = db.IntegerProperty(default=UserLevel.pending)   # 0 root    1 normal user
    password = db.TextProperty()
    create_time = db.DateTimeProperty(auto_now_add=True)

