
from application.data_models.count_model import *
import logging

class DocumentModel(object):
    exception = 1
    log = 2
    crash = 3

class BaseService(object):
    # return count of name
    def count(self, name):
        counts = db.GqlQuery('select * from CountModel where name = :1', name)
        if counts.count(1) == 0:
            return 0
        return counts.fetch(1)[0].value


    # increment count of name
    def count_add(self, name):
        counts = db.GqlQuery('select * from CountModel where name = :1 limit 1', name)
        if counts.count(1) == 0:
            count = CountModel()
            count.name = name
            count.value = 1
            count.put()
        else:
            count = counts[0]
            self.increment_counter(count.key(), 1)
    @db.transactional()
    def increment_counter(self, key, amount):
        obj = CountModel.get(key)
        obj.value += amount
        obj.put()


    # decrease count of name
    def count_sub(self, name):
        counts = db.GqlQuery('select * from CountModel where name = :1 limit 1', name)
        if counts.count(1) == 0:
            count = CountModel()
            count.name = name
            count.value = 0
            count.put()
        else:
            count = counts[0]
            self.decrease_counter(count.key(), 1)
    @db.transactional()
    def decrease_counter(self, key, amount):
        obj = CountModel.get(key)
        if obj.value > 0:
            obj.value -= amount
            obj.put()