
from base_form import *
from wtforms import TextField, validators



class ProfileForm(BaseForm):
    name = TextField('Name',
                     validators=[validators.length(min=1, max=50)],
                     filters=[lambda x: x.strip() if isinstance(x, basestring) else None])
