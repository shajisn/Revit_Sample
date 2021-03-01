from src.app import settings

import connexion
from boxsdk import JWTAuth, Client
import io
import datetime

def create_service_auth():
        service_account_auth = JWTAuth(
            client_id=settings.box_client_id,
            client_secret=settings.box_secret,
            enterprise_id = settings.box_enterprise_id,
            jwt_key_id = settings.box_jwt_key_id,
            rsa_private_key_file_sys_path =settings.rsa_private_key_file_sys_path,
            rsa_private_key_passphrase = settings.rsa_private_key_passphras)
        
        print(f"service account - {service_account_auth}")
        return service_account_auth

def create_appuser():
        service_account_auth = create_service_auth()
        service_account_client = Client(service_account_auth)
        app_user = service_account_client.user(user_id='15143905465')
        return app_user

def create_user_auth(app_user):
        app_user_auth = JWTAuth(
            client_id=settings.box_client_id,
            client_secret=settings.box_secret,
            user=app_user,
            enterprise_id = settings.box_enterprise_id,
            jwt_key_id = settings.box_jwt_key_id,
            rsa_private_key_file_sys_path =settings.rsa_private_key_file_sys_path,
            rsa_private_key_passphrase = settings.rsa_private_key_passphras
            )
        print(f"user account - {app_user_auth}")
        return app_user_auth

def make_client():
        service_account_auth = create_service_auth()
        app_user = create_appuser()
        print(f"app user - {app_user}")
        app_user_auth = create_user_auth(app_user)
        access_token = service_account_auth.authenticate_instance()
 
        app_user_auth.authenticate_user()
        service_account_client = Client(service_account_auth)
        app_user_client = Client(app_user_auth)

        return app_user_client