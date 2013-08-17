
# flask
from flask import Flask

# application
import config



app = Flask(__name__)
app.config.from_object('application.config')


if app.debug:
    # decompress gzip, gae developer tool do not support gzip
    class WSGIUngzipBody(object):
        def __init__(self, application):
            self.application = application

        def __call__(self, environ, start_response):
            content_encoding = environ.get('HTTP_CONTENT_ENCODING')
            if content_encoding and content_encoding.find('gzip') >= 0:
                del environ['HTTP_CONTENT_ENCODING']
                # request body is gzip data
                import gzip, StringIO

                length = environ.get('CONTENT_LENGTH', '0')
                length = 0 if length == '' else int(length)
                body = environ['wsgi.input'].read(length)

                # un gzip
                gzipped = StringIO.StringIO(body)
                reader = gzip.GzipFile(fileobj=gzipped, mode='rb')
                new_content = reader.read()

                environ['CONTENT_LENGTH'] = str(len(new_content))
                environ['wsgi.input'] = StringIO.StringIO(new_content)

            # Call the wrapped application
            app_iter = self.application(environ, self._sr_callback(start_response))

            # Return modified response
            return app_iter

        def _sr_callback(self, start_response):
            def callback(status, headers, exc_info=None):

                # Call upstream start_response
                start_response(status, headers, exc_info)
            return callback
    app.wsgi_app = WSGIUngzipBody(app.wsgi_app)


# set up router
from handlers import base_handler
import routes
