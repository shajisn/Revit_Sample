import src
from src import celery_app
from src.app import init_celery, create_flask_rest_app
from src.extensions import init_settings

flask_app = create_flask_rest_app()
init_celery(celery_app, flask_app.app)
init_settings(src.app.settings)
# init_celery(celery, app)

