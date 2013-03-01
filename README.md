#Takanashi

Kelp http://kelp.phate.org/  
[MIT License][mit]  
[MIT]: http://www.opensource.org/licenses/mit-license.php


Takanashi is an error reporting server. It runs on Google App Engine.  
You could download this project and then deploy to GAE with free plan.  
Your app could send error information to Takanashi with RESTful API.  
**iOS example code: https://github.com/Kelp404/Takanashi-iOS**  


<img src='https://raw.github.com/Kelp404/Takanashi/master/_images/screenshot00.png' height='488px' width='850px' />


##Demo
url: https://takanashi-demo.appspot.com  
  
**post handled exception**  
go to application page then get application key:  
https://takanashi-demo.appspot.com/settings/applications  
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
<img src='https://raw.github.com/Kelp404/Takanashi/master/_images/screenshot02.png' height='599px' width='850px' />



##Deploy
You should create a GAE account.  
https://appengine.google.com  
  
###update `app.yaml`
```Python
application: takanashi-demo
'takanashi-demo' should replace to your Application Identifier.
```


###update `config.py`
```Python
# web site domain. your gae application domain.
domain = 'takanashi-demo.appspot.com'

# this account is for sending email. it should be your gae account.
gae_account = 'your-name@gmail.com'


# Takanashi use Google Account API
# The first signing in user is root.
# if allow_register is true, every one could use Google Account to sign in Takanashi.
allow_register = True
```


###deploy project
Upload files with SDK.  
**deploy**
```Python
appcfg.py update Takanashi/
* Takanashi is the folder name of the project
```
**deploy backends**
```
appcfg.py backends Takanashi/ update
```

ref:  
https://developers.google.com/appengine/docs/python/gettingstartedpython27/uploading  
https://developers.google.com/appengine/downloads  

*First deploy you should wait GAE building indexes.  
<img src='https://raw.github.com/Kelp404/Takanashi/master/_images/screenshot01.png' height='425px' width='850px' />



##RESTful Web Service
**Crash (only for iOS)**  
`POST` your-domain/api/v1/crash/{ application key }  
> Content-Type:`multipart/form-data`  
  
**send crash reports:**  
> send reports by KSCrash  
> https://github.com/Kelp404/KSCrash  

---
**Handled Exception**  
`GET` your-domain/api/v1/exception/{ application key } **(for JSONP)**  
`POST` your-domain/api/v1/exception/{ application key }  
> Content-Type:`application/x-www-form-urlencoded` / `application/json`  
  
**Log**  
`GET` your-domain/api/v1/log/{ application key } **(for JSONP)**  
`POST` your-domain/api/v1/log/{ application key }  
> Content-Type:`application/x-www-form-urlencoded` / `application/json`  

**send handled exception, log reports:**  
```JavaScript
{
    "name": "User Name", // required
    "title": "log title", // required
    "description": "log description",
    "email": "User's email",

    "version": "application version",
    "device": "device machine name",
    "os_version": "device os version",

    "access_token": "oauth access token",
    "timeout": "timeout of http request",
    "method": "method of http request",
    "url": "url of http request",
    "parameters": "parameters of http request",
    "status": "status of http response",

    "create_time": "yyyy-MM-ddTHH:mm:ss"
}
```


##Close mini profiler  
update `/gae_mini_profiler/config.py`  
```Python
# Default, mini profiler will work when user is admin
# close mini profiler:

def _should_profile_production_default():
    return False
```
ref: https://github.com/kamens/gae_mini_profiler



##Send Email on Google App Engine SDK (localhost
If you would to send email on localhost with GAE SDK, you should change application settings, else you will get some message.  
```
INFO     2013-01-30 03:28:17,547 mail_stub.py:138] MailService.Send
  From: kelp[at]phate.org
  To: email@gmail.com
  Subject: Kelp has invited you to join Takanashi.
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
