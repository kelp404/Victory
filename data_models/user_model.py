
from google.appengine.ext import db

class UserLevel(object):
    root = 0
    normal = 1

class UserModel(db.Model):
    email = db.StringProperty()
    name = db.TextProperty()
    level = db.IntegerProperty(default=UserLevel.normal)   # 0 root    1 normal user
    create_time = db.DateTimeProperty(auto_now_add=True)
