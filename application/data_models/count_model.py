
from google.appengine.ext import db

class CountModel(db.Model):
    name = db.StringProperty()
    value = db.IntegerProperty()

