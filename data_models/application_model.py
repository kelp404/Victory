
from google.appengine.ext import db

class ApplicationModel(db.Model):
    app_name = db.StringProperty()
    description = db.TextProperty()
    app_key = db.StringProperty()
    owner = db.IntegerProperty()
    viewer = db.ListProperty(long, indexed=True, default=[])
    create_time = db.DateTimeProperty(auto_now_add=True)

    def dict(self):
        result = {
            'id': self.key().id(),
            'name': self.app_name,
            'description': self.description,
            'app_key': self.app_key,
            'create_time': self.create_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        return result
