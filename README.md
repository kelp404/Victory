#Victory

Kelp https://twitter.com/kelp404  
[MIT License][mit]  
[MIT]: http://www.opensource.org/licenses/mit-license.php


Victory is an error reporting server. It runs on Google App Engine.
You could download this project and then deploy to GAE with free plan.  
Your app could send error information to Victory with RESTful API.


<img src='https://raw.github.com/kelp404/Victory/master/_images/screenshot00.png' height='488px' width='850px' />


##Demo
url: https://victory-demo.appspot.com
  
**post handled exception**  
go to application page then get application key:  
https://victory-demo.appspot.com/settings/applications
```JavaScript
// post test data with jQuery.
$.ajax({
    type: 'post',
    url:'/api/v1/exception/714457c7-5222-48da-b445-e7d97ee174a9',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
        title:'load data error',
        name:'Kelp',
        email:'demo@phate.org',
        description: "web service error",
        version: "1.0",
        device: "iPhone3,1",
        os_version: "6.1",
        access_token: "0123120592",
        timeout: "30",
        method: "POST",
        url: "http://webservice.com/api/members",
        parameters: "user_id=10",
        status: "500",
    })
})
```
<img src='https://raw.github.com/kelp404/Victory/master/_images/screenshot02.png' height='599px' width='850px' />


##Clone
```
$ git clone --recursive git://github.com/kelp404/Victory.git
```


##Deploy
You should create a GAE account.  
https://appengine.google.com  
  
###update `app.yaml`
```Python
application: victory-demo
'victory-demo' should replace to your Application Identifier.
```


###update `config.py`
```Python
# web site domain. your gae application domain.
domain = 'victory-demo.appspot.com'

# this account is for sending email. it should be your gae account.
gae_account = 'your-name@gmail.com'


# Victory use Google Account API
# The first signing in user is root.
# if allow_register is true, every one could use Google Account to sign in Victory.
allow_register = True
```


###deploy project
Upload files with SDK.  
**deploy**
```Python
appcfg.py update Victory/
* Victory is the folder name of the project
```
**deploy backends**
```
appcfg.py backends Victory/ update
```

ref:  
https://developers.google.com/appengine/docs/python/gettingstartedpython27/uploading  
https://developers.google.com/appengine/downloads  

*First deploy you should wait GAE building indexes.  
<img src='https://raw.github.com/Kelp404/Victory/master/_images/screenshot01.png' height='425px' width='850px' />


##iOS example code

###https://github.com/kelp404/Victory-iOS




##RESTful Web Service

###http://docs.victory.apiary.io/



##Unittest
Before test, you should run GAE local server, and clear datastore, text search, and update url in function `TestVictoryFunctions.setUp()`.
```Python
class TestVictoryFunctions(unittest.TestCase):
    def setUp(self):
        self.url = 'http://localhost:8080'
        self.email = 'kelp@phate.org'
        self.cookies = { 'dev_appserver_login': "kelp@phate.org:True:111325016121394242422" }
```
clear datastore & text search:
```
--clear_datastore=yes --clear_search_indexes=yes
```
```
$ cd Victory
$ python tests
```
References:  
+ <a href="http://docs.python.org/2/library/unittest.html" target="_blank">Python unit test</a>
+ <a href="https://github.com/kennethreitz/requests" target="_blank">Requests on GitHub</a>
+ <a href="http://www.crummy.com/software/BeautifulSoup/bs4/doc/" target="_blank">Beautiful Soup</a>



##Enable/Disable mini profiler on GAE  
update `/gae_mini_profiler/config.py`  
```Python
# Default, mini profiler will work when user is admin
# close mini profiler:

def _should_profile_production_default():
    # disable
    return False

    # enable
    from google.appengine.api import users
    return users.is_current_user_admin()
```
ref: https://github.com/kamens/gae_mini_profiler



##Send Email on Google App Engine SDK (localhost
If you would to send email on localhost with GAE SDK, you should change application settings, else you will get some message.  
```
INFO     2013-01-30 03:28:17,547 mail_stub.py:138] MailService.Send
  From: kelp[at]phate.org
  To: email@gmail.com
  Subject: Kelp has invited you to join Victory.
  Body:
    Content-type: text/plain
    Data length: 131
INFO     2013-01-30 03:28:17,548 mail_stub.py:294]
 You are not currently sending out real email.  If you have sendmail installed you can use it by using the server with --enable_sendmail
```

Open **GoogleAppEngineLauncher** >> Edit >> Application Settings (⌘ + I)  
add `--enable_sendmail` into Launch Settings >> Extra Flags.  

Then open terminal.  
```
sudo ln -s /usr/sbin/sendmail /usr/bin/sendmail
```
ref: http://stackoverflow.com/questions/1900029/google-app-engine-sendmail-command-not-found
