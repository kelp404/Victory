app_name = 'Takanashi'

# login cookie name
cookie_auth = 'takanashi_auth'

# web site domain. your gae application domain.
domain = 'your-domain.appspot.com'

# this account is for send email. it should be your gae account.
gae_account = 'your-name@gmail.com'

# root user. it will be create while no account in the application.
default_account_email = 'your-name@gmail.com'
default_account_name = 'your-name'
# takanashi use sha256 to hash password
#   import hashlib
#   hashlib.sha256('password').hexdigest()
default_account_password = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'

# delete documents after x days
document_expiration = 30
# delete session after x days
session_expiration = 30

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
