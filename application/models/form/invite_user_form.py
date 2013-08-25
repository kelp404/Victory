
from base_form import *
from wtforms import TextField, validators



class InviteUserForm(BaseForm):
    email = TextField('Email',
                      validators=[validators.email()],
                      filters=[lambda x: x.strip() if isinstance(x, basestring) else None])
