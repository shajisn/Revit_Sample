#
# helper class for Forge API's 
#
from flask import jsonify
import requests
import json, os
import re
from src.providers.BoxProvider import make_client

class ForgeProvider(object):
        
    def init_app(self, settings):
        self.settings = settings
        self.MODEL_DERIVATIVE_V2 = '/modelderivative/v2/designdata/'
    

    def login(self):
        scopes = 'data:read data:write data:create data:search bucket:create bucket:read bucket:update bucket:delete';
        login_uri = 'authentication/v1/authenticate'

        body = {
            'client_id': self.settings.forge_client_id,
            'client_secret': self.settings.forge_secret,
            'grant_type': 'client_credentials',
            'scope': scopes
        }

        headers = {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }

        forge_url = f'{self.settings.forge_url}{login_uri}'
        print("Calling " + forge_url + " ...")
        r = requests.post(forge_url, data=body, headers=headers)
        print(f"Response {r.content.decode('utf-8')} ...")
        content = eval(r.content)
 
        return content
    

    def create_bucket(self, bucket_name, access_token):
        BUCKET_KEY = f'{self.settings.forge_client_id}_{bucket_name}'.lower()
        print(f'Creating bucket {BUCKET_KEY} ...')

        forge_url = f"{self.settings.forge_url}oss/v2/buckets/{BUCKET_KEY}/details"
        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.get(forge_url, headers=headers)
        print(f"GET Bucket API status={r.status_code} message={r.content.decode('utf-8')}")

        if 200 != r.status_code:
            # Create a new bucket:
            url = self.settings.forge_url + 'oss/v2/buckets'

            data = {
                'bucketKey' : BUCKET_KEY,
                'policyKey' : 'transient'
            }
            headers = {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + access_token
            }

            r = requests.post(url, data=json.dumps(data), headers=headers)
            print(f"Create bucket API status={r.status_code} message={r.content.decode('utf-8')}")

            if 200 != r.status_code:
                raise Exception("Bucket creation failed " + r.content.decode('utf-8'))

            content = eval(r.content) 
            return content
        else:
            raise Exception("Bucket with the name already exists")

    def delete_bucket_details(self, bucket_name, access_token):
        BUCKET_KEY = f'{self.settings.forge_client_id}_{bucket_name}'.lower()
        print(f'Deleting bucket {BUCKET_KEY} ...')

        forge_url = f"{self.settings.forge_url}oss/v2/buckets/{BUCKET_KEY}"

        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.delete(forge_url, headers=headers)
        print(f"DELETE Bucket API status={r.status_code} message={r.content.decode('utf-8')}")
        if 409 == r.status_code:
            import time
            time.sleep(7)
            print(f"after delaying the deletion process")
            return self.delete_bucket_details(bucket_name,access_token)
        elif 200 != r.status_code:
            raise Exception(f"Deleting bucket {BUCKET_KEY} details failed with error {r.content.decode('utf-8')}...")
        else:
            return {"Bucket_Status":"deleted"}


    def get_bucket_details(self, bucket_name, access_token):
        BUCKET_KEY = f'{self.settings.forge_client_id}_{bucket_name}'.lower()
        print(f'Getting bucket {BUCKET_KEY} details ...')

        forge_url = f"{self.settings.forge_url}oss/v2/buckets/{BUCKET_KEY}/details"

        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.get(forge_url, headers=headers)
        print(f"GET Bucket API status={r.status_code} message={r.content.decode('utf-8')}")
        if 200 != r.status_code:
            raise Exception(f"Getting bucket {BUCKET_KEY} details failed with error {r.content.decode('utf-8')}...")

        content = eval(r.content) 
        return content
    

    def upload_revit_file(self, bucket_name, revit_filename, box_file_id, access_token):  
        BUCKET_KEY = f'{self.settings.forge_client_id}_{bucket_name}'.lower()
        print(f'Uploading file {revit_filename} to bucket {BUCKET_KEY} ...')

        forge_file_name = f"{revit_filename}"

        forge_url = f"{self.settings.forge_url}oss/v2/buckets/{BUCKET_KEY}/objects/{forge_file_name}"

        headers = {
            'Content-Type' : 'application/octet-stream',
            'Authorization' : 'Bearer ' + access_token
        }

        # RECORDS_PATH = "/tmp/"
        # filepath = os.path.join(RECORDS_PATH, revit_filename)

        # with open(filepath, 'rb') as f:
        #     r = requests.put(forge_url, headers=headers, data=f)

        print("Downloading from the box folder started")
        app_user_client = make_client()
        file_content = app_user_client.file(box_file_id).content()
        r = requests.put(forge_url, headers=headers, data=file_content)

        print(f"Upload file API status={r.status_code} message={r.content.decode('utf-8')}")
        
        if 200 != r.status_code:
            raise Exception("File upload to forge failed " + r.content.decode('utf-8'))

        content = eval(r.content) 
        return content


    def register_viewer_services(self, urn, access_token):

        print(f'Registering viewer services URN {urn} ...')
        import base64
        urn = base64.b64encode(urn.encode("utf-8"))
        base64_string = urn.decode("utf-8")

        forge_url = f'{self.settings.forge_url}{self.MODEL_DERIVATIVE_V2}job'

        data = {
            "input": {
                "urn": base64_string
            },
            "output": {
                "formats": [
                    {
                        "type": "svf",
                        "views":["2d", "3d"]
                    }
                ]
            }
        }

        headers = {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + access_token
        }
        r = requests.post(forge_url, data=json.dumps(data), headers=headers)
        print(f"Upload file API status={r.status_code} message={r.content.decode('utf-8')}")
        
        if 200 != r.status_code:
            raise Exception("Register forge views to forge failed " + r.content.decode('utf-8'))

        content = eval(r.content) 
        return content


    def getMetadata(self, urn, access_token):
        print(f'{urn} Downloading metadata...')
        import base64
        urn = base64.b64encode(urn.encode("utf-8"))
        base64_string = urn.decode("utf-8")

        forge_url = f'{self.settings.forge_url}{self.MODEL_DERIVATIVE_V2}{base64_string}/metadata'

        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.get(forge_url, headers=headers)
        print(f"GET Metadata API status={r.status_code} message={r.content.decode('utf-8')}")
        
        if 200 != r.status_code:
            raise Exception(f"Failed to get metadata of {urn} " + r.content.decode('utf-8'))

        content = eval(r.content) 
        return content
    

    def getHierarchy(self, urn, guid, access_token):
        print(f'... {urn} GUID {guid} get Hierarchy ...')
        import base64
        urn_enc = base64.b64encode(urn.encode("utf-8"))
        base64_string = urn_enc.decode("utf-8")

        forge_url = f'{self.settings.forge_url}{self.MODEL_DERIVATIVE_V2}{base64_string}/metadata/{guid}'

        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.get(forge_url, headers=headers)
        print(f"GET Hierrachy API status={r.status_code} message={r.content.decode('utf-8')}")
        
        if 202 == r.status_code:
            print(f"RETRYING - Hierrachy API status={r.status_code} ...")
            import time
            time.sleep(7)
            return self.getHierarchy(urn, guid, access_token)
        elif 200 != r.status_code :
            raise Exception(f"Failed to get Hierarchy of {urn} " + r.content.decode('utf-8'))
        else:
            content = eval(r.content) 
            return content
    

    def getProperties(self, urn, guid, access_token):
        print(f'... {urn} GUID {guid} get properties ...')
        import base64
        urn = base64.b64encode(urn.encode("utf-8"))
        base64_string = urn.decode("utf-8")

        forge_url = f'{self.settings.forge_url}{self.MODEL_DERIVATIVE_V2}{base64_string}/metadata/{guid}/properties'

        headers = {
            'Authorization' : 'Bearer ' + access_token
        }
        # Call Get API to check bucket already exists or not.
        r = requests.get(forge_url, headers=headers)
        print(f"GET Propeties API status={r.status_code} message={r.content.decode('utf-8')}")
        
        if 200 != r.status_code:
            raise Exception(f"Failed to get properties of {urn} " + r.content.decode('utf-8'))
            
        content = eval(r.content) 
        return content
  
    
    def prepareRawData(self, hierarchy, properties):
        try:
            print(f'Preparing raw data ...')
            tables = {}
            hierarchyObjects = hierarchy["data"]["objects"][0]["objects"]
            for category in hierarchyObjects:
                category_name = category["name"]
                print(f"Processing {category_name} -- {category}")
                idsOnCategory = []
                self.getAllElementsOnCategory(idsOnCategory, category["objects"])
            
                rows = []
                for object_id in idsOnCategory:
                    columns = self.getObjectIDProperties(object_id, properties)
                    print("JSON Data adding columns to row ...")
                    rows.append(columns)
                
                print("JSON Data adding row to table ...")
                tables[category_name] = rows
            
            return tables
        except Exception as ex:
            print(f"Prepare raw data - Error {str(ex)}")
            raise ex
           

    def getAllElementsOnCategory(self, ids, category):
        print(f"All category Items = {category}")
        print()
        for item in category:
            
            try:
                iObjs = item["objects"]
            except:
                iObjs = None            
            print(f"Category Item {item} with child objects {iObjs}")
            print()
            if not iObjs:
                print(f"Attribute Object-ID = {item['objectid']}")
                if item["objectid"] not in ids:
                    print(f"Adding Object-ID = {item['objectid']}")
                    ids.append(item["objectid"])
                else:
                    print(f'ObjectID {item["objectid"]} already exist...')
            else:
                print(f"Item  {item['objectid']} have Sub-Hierarchy. Processing them ...")
                self.getAllElementsOnCategory(ids, iObjs)


    def getObjectIDProperties(self, id, properties):
        print(f"Process properties for Object-ID {id} ... ")
        data = {}
        objCollection = properties["data"]["collection"]
        for obj in objCollection:
            if obj["objectid"] != id:
                # print(f"Skipping object-id {obj['objectid']} since not matching ...")
                continue

            print(f"Adding object-id {obj['objectid']} with name {obj['name']} ...")

            data['Viewer ID'] = id
            match = re.findall(r'\d+', obj["name"])
            print(f"Regex match {match}")
            if len(match) > 0:
                data['Revit ID'] = match[0]
            else:
                 data['Revit ID'] = ""
            data['Name'] = obj["name"].replace('[' + data['Revit ID'] + ']', '').strip()

            for propGroup in obj["properties"]:
                if "__" in propGroup:
                    print("............... breaking loop for '__' ..................") 
                    print()
                    break
                try:
                    prop_grp = obj["properties"][propGroup]
                except:
                    prop_grp = None

                if prop_grp:
                    print(f"Parsing property group {prop_grp}")
                    for propName in prop_grp:
                        try:
                            prop_val = prop_grp[propName]
                        except:
                            prop_val = None
                        print(f"Parsing property {propName} in group {prop_grp}")
                        if not prop_val is None and not isinstance(prop_val, list):
                            print(f"Set property {propName} in group = {prop_grp} property = {prop_val}")
                            # data[propGroup + ':' + propName] = obj.properties[propGroup][propName];
                            data[propGroup + ':' + propName] = prop_val
        print(f"Processed properties for Object-ID {id} = {data} ... ")
        return data


