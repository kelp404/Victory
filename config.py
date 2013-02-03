app_name = 'Takanashi'

# web site domain. your gae application domain.
domain = 'takanashi-demo.appspot.com'

# Takanashi use Google Account API
# The first signing in user is root.
# if allow_register is true, every one could use Google Account to sign in Takanashi.
allow_register = True

# this account is for send email. it should be your gae account.
gae_account = 'kelp.phate@gmail.com'

# delete documents after x days
document_expiration = 30

# data result pager size
page_size = 20


webapp2_config = {}
webapp2_config['webapp2_extras.jinja2'] = {
    'template_path': 'views',
#    'environment_args': {'extensions': ['jinja2.ext.i18n']},
}

error_templates = {
    403: 'errors/default_error.html',
    404: 'errors/default_error.html',
    500: 'errors/default_error.html',
}

# jinja2 base layout templates
base_layout = '_base.html'
