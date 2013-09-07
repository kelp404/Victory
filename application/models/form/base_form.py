
from wtforms import Form



class BaseForm(Form):
    def validated_messages(self):
        result = {}
        keys = self._fields.keys()
        for key in keys:
            field = self._fields[key]
            result[self._prefix + key] = field.errors[0] if field.errors else None
        return result
