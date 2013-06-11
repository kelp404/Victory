app_name = 'Victory'

# web site domain. your gae application domain.
domain = 'victory-demo.appspot.com'

# Victory use Google Account API
# The first signing in user is root.
# if allow_register is true, every one could use Google Account to sign in Victory.
allow_register = True

# this account is for send email. it should be your gae account.
gae_account = 'kelp.phate@gmail.com'

# delete documents after x days
document_expiration = 30

# data result pager size
page_size = 20


import os
DEBUG_MODE = False
# Auto-set debug mode based on App Engine dev environ
if 'SERVER_SOFTWARE' in os.environ and os.environ['SERVER_SOFTWARE'].startswith('Dev'):
    DEBUG_MODE = True
DEBUG = DEBUG_MODE