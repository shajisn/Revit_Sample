
########### Utility Functions ###########

import requests, json
import jwt
from jwt.algorithms import get_default_algorithms
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend

from src.app import settings

PEMSTART = "-----BEGIN CERTIFICATE-----\n"
PEMEND = "\n-----END CERTIFICATE-----\n"

def extract_public_key(pub_key):
    cert_str = PEMSTART + pub_key + PEMEND

    cert_obj = load_pem_x509_certificate(cert_str.encode(), default_backend())
    return cert_obj.public_key()

def decode_token(token):
    print("Token = " + token)
    access_token = token.replace('Bearer ', '')
    token_header = jwt.get_unverified_header(access_token)
    res = requests.get(settings.identity_server_url)
    jwk_uri = res.json()['jwks_uri']
    print(f'jwks_uri = {jwk_uri}\nToken Header = {token_header}')
    res = requests.get(jwk_uri)
    jwk_keys = res.json()
    key = jwk_keys['keys'][0]
    public_key = extract_public_key(key['x5c'][0])

    try:
        result = jwt.decode(access_token, public_key, algorithms=[token_header['alg']],
            audience=settings.resource_server_url, verify=True)
        print(f'Decoded JWT = {result}')
        return result
    except jwt.DecodeError:
        return False