
from google.appengine.ext import db

class ExceptionModel(db.Model):
    app_id = db.IntegerProperty()
    group_tag = db.StringProperty()
    name = db.TextProperty()
    title = db.TextProperty()
    version = db.TextProperty()
    user_agent = db.TextProperty()
    access_token = db.TextProperty()
    timeout = db.TextProperty()
    email = db.TextProperty()
    method = db.TextProperty()
    url = db.TextProperty()
    parameters = db.TextProperty()
    description = db.TextProperty()
    device = db.TextProperty()
    status = db.TextProperty()
    os_version = db.TextProperty()
    ip = db.TextProperty()
    create_time = db.DateTimeProperty(auto_now_add=True)

    def dict(self):
        result = {
            'name': self.name,
            'group_tag': self.group_tag,
            'email': self.email,
            'user_agent': self.user_agent,
            'url': self.url,
            'status': self.status,
            'method': self.method,
            'parameters': self.parameters,
            'description': self.description,
            'os_version': self.os_version,
            'device': self.device,
            'timeout': self.timeout,
            'access_token': self.access_token,
            'title': self.title,
            'version': self.version,
            'ip': self.ip,
            'create_time': self.create_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        }
        return result
