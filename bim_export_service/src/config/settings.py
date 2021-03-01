import json

class Settings:

    host = ...  # type: str
    port = ...
    debug_flag = ...

    forge_url = ...  # type: str
    forge_client_id = ...  # type: str
    forge_secret = ...  # type: str
    
    mongo_url = ...  # type: str
    mongo_db_name = ... #type: str
    mongo_coll_name = ... # type: str

    celery_broker_url = ...  # type: str
    celery_backend_result = ...  # type: str
    redis_host = ...  # type: str
    redis_port = ...  # type: str
    redis_secret = ...  # type: str

    identity_server_url = ...  # type: str
    resource_server_url = ...  # type: str

    def __init__(self, config_file):
        with open(config_file) as f:
            config_json = json.load(f)
            print("Setting Json - {0}".format(config_json))
            self.init_with_json(config_json)

    def init_with_json(self, config_json):
        Settings.host = config_json["server_config"]["host"]
        Settings.port = config_json["server_config"]["port"]
        Settings.debug_flag = config_json["server_config"]["debug"]

        Settings.forge_url = config_json["forge_config"]["forge_connection_url"]
        Settings.forge_client_id = config_json["forge_config"]["forge_client_id"]
        Settings.forge_secret = config_json["forge_config"]["forge_client_secret"]

        Settings.identity_server_url = config_json["authn"]["identity_server_url"]
        Settings.resource_server_url = config_json["authn"]["resource_server_url"]

        Settings.celery_broker_url = config_json["celery_config"]["broker_url"]
        Settings.celery_backend_result = config_json["celery_config"]["backend_result"]
        # Settings.redis_host = config_json["celery_config"]["redis_host"]
        # Settings.redis_port = config_json["celery_config"]["redis_port"]
        Settings.redis_port = '6379'
        Settings.redis_host = 'redis'

        Settings.redis_secret = config_json["celery_config"]["redis_secret"]
        
        Settings.mongo_url = config_json["mongo_config"]["mongo_url"]
        Settings.mongo_db_name = config_json["mongo_config"]["mongo_db_name"]
        Settings.mongo_coll_name = config_json["mongo_config"]["mongo_coll_name"]

        Settings.box_client_id = config_json["box_config"]["box_client_id"]
        Settings.box_secret = config_json["box_config"]["box_client_secret"]
        Settings.box_enterprise_id = config_json["box_config"]["box_enterprise_id"]
        Settings.box_jwt_key_id = config_json["box_config"]["box_jwt_key_id"]
        Settings.rsa_private_key_file_sys_path = config_json["box_config"]["box_rsa_private_key_file_sys_path"]
        Settings.rsa_private_key_passphras = config_json["box_config"]["box_rsa_private_key_passphrase"]
               
