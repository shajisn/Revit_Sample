import src
from src.app import create_flask_rest_app
from src.extensions import init_settings

if __name__ == "__main__":
    flask_app = create_flask_rest_app(celery=src.celery_app)
    init_settings(src.app.settings)
    print("Starting Flask applications ...")
    flask_app.run(debug=src.app.settings.debug_flag, port=src.app.settings.port, host=src.app.settings.host)
    
