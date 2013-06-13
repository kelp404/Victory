
from google.appengine.ext import db
import json

class CrashModel(db.Model):
    # victory
    app_id = db.IntegerProperty()
    group_tag = db.StringProperty()
    # app uuid in crash report
    app_uuid = db.StringProperty()

    name = db.TextProperty()
    title = db.TextProperty()
    email = db.TextProperty()
    description = db.TextProperty()
    access_token = db.TextProperty()
    version = db.TextProperty()
    os_version = db.TextProperty()
    device = db.TextProperty()
    user_agent = db.TextProperty()
    ip = db.TextProperty()

    create_time = db.DateTimeProperty(auto_now_add=True)

    # kscrash
    report_json = db.TextProperty()
    @property
    def report(self):
        return json.loads(self.report_json)
    @report.setter
    def report(self, value):
        self.report_json = json.dumps(value)

    def dict(self):
        result = {
            'name': self.name,
            'group_tag': self.group_tag,
            'email': self.email,
            'user_agent': self.user_agent,
            'description': self.description,
            'os_version': self.os_version,
            'device': self.device,
            'access_token': self.access_token,
            'title': self.title,
            'app_uuid': self.app_uuid,
            'version': self.version,
            'report': self.report,
            'ip': self.ip,
            'create_time': self.create_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        }
        return result
