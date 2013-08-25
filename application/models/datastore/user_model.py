
from google.appengine.ext import db

class UserLevel(object):
    root = 0
    normal = 1

class UserModel(db.Model):
    email = db.StringProperty()
    name = db.TextProperty()
    level = db.IntegerProperty(default=UserLevel.normal)   # 0 root    1 normal user
    create_time = db.DateTimeProperty(auto_now_add=True)

    def dict(self):
        result = {
            'id': self.key().id(),
            'name': self.name,
            'email': self.email,
            'level': self.level,
            'is_deletable': self.level != UserLevel.root,
            'create_time': self.create_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        return result
