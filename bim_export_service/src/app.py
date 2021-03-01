###
### Main Appication Instance creation ###
###
import sys, os, src
import connexion
from connexion.resolver import RestyResolver
from flask_cors import CORS

from src.config.settings import Settings
from flask.app import Flask

ext_config_path = "./config.json"
settings = Settings(ext_config_path)

PKG_NAME = os.path.dirname(os.path.realpath(__file__)).split("/")[-1]

def create_flask_rest_app(app_name=PKG_NAME, **kwargs):
    print(f"Creating Flask REST application {__name__} ...")
    flask_app = connexion.App(__name__, specification_dir='swagger/')
    
    if kwargs.get("celery"):
        init_celery(kwargs.get("celery"), src.app)

    CORS(flask_app.app)
    flask_app.add_api('bim_api.yaml', resolver=RestyResolver('api'))

    return flask_app

def create_flask_app(app_name=PKG_NAME, **kwargs):
    print(f"Creating Flask application {__name__} ...")
    flask_app = connexion.App(__name__, specification_dir='swagger/')
    return flask_app

def init_celery(celery_app, app):
    print("Init celery ...")
    # celery_app.conf.update(app.config)
    TaskBase = celery_app.Task
    class ContextTask(TaskBase):
        def __call__(self, *args, **kwargs):
            print(f"Setting celery context ...")
            with app.app_context():
                print(f"TaskBase call ...")
                return TaskBase.__call__(self, *args, **kwargs)
    celery_app.Task = ContextTask