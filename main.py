
import os
import webapp2
import config
import routes

from handlers.base_handler import handle_error

app = webapp2.WSGIApplication(debug = os.environ['SERVER_SOFTWARE'].startswith('Dev'), config=config.webapp2_config)

app.error_handlers[403] = handle_error
app.error_handlers[404] = handle_error
if not app.debug:
    app.error_handlers[500] = handle_error
routes.add_routes(app)

