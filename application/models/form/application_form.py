
from base_form import *
from wtforms import TextField, validators



class ApplicationForm(BaseForm):
    name = TextField('Name',
                     validators=[validators.length(min=1, max=50)],
                     filters=[lambda x: x.strip() if isinstance(x, basestring) else None])

    description = TextField('Description',
                            validators=[validators.length(min=0, max=100)],
                            filters=[lambda x: x.strip() if isinstance(x, basestring) else None])
