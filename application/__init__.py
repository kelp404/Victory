
from flask import Flask
import gae_mini_profiler.profiler
import config

app = Flask(__name__)
app.config.from_object('application.config')

# set up router
from handlers import base_handler
import routes

# set up mini profiler
app = gae_mini_profiler.profiler.ProfilerWSGIMiddleware(app)
