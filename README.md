#Takanashi

Kelp http://kelp.phate.org/  
[MIT License][mit]  
[MIT]: http://www.opensource.org/licenses/mit-license.php


Takanashi is an error reporting server. It runs on Google App Engine.  
You could download this project and then deploy to GAE with free plan.  
Your app could send error information to Takanashi with RESTful API.  


<img src='https://raw.github.com/Kelp404/Takanashi/master/_images/screenshot00.png' height='378px' width='850px' />


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

# this account is for send email. it should be your gae account.
gae_account = 'kelp.phate@gmail.com'

# root user. it will be create while no account in the application.
default_account_email = 'kelp@phate.org'
default_account_name = 'Kelp'
default_account_password = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
# takanashi use sha256 to hash password
#   import hashlib
#   hashlib.sha256('password').hexdigest()
```

###deploy project
You could use SDK to upload files.  
And last you should use terminal to deploy backends (SDK does not deploy backends).  
```
appcfg.py backends takanashi/ update
* takanashi is the folder name of project
```

ref:  
https://developers.google.com/appengine/docs/python/gettingstartedpython27/uploading  
https://developers.google.com/appengine/downloads  

*First deploy you should wait GAE building indexes.  
<img src='https://raw.github.com/Kelp404/Takanashi/master/_images/screenshot01.png' height='425px' width='850px' />



##RESTful API
**Handled Exception**  
`POST` your-domain/api/v1/exception/{ application key }  
  
**Log**  
`POST` your-domain/api/v1/log/{ application key }  
  
**request body**  
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
}
```



##Send Email on Google App Engine SDK (localhost
If you would to send email on localhost with GAE SDK, you should change application settings.  
Or you will get some message.  
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
ref: 
http://stackoverflow.com/questions/1900029/google-app-engine-sendmail-command-not-found
