import random, time, os

from src import celery_app
import json
from src.api.box_api import box_upload,box_download

@celery_app.task(queue="forge_queue")
def forge_upload(job_name, file_path):
    from src.extensions import data_provider
    from src.providers.MongoProvider import update_job_order, get_job_order

    print("Starting background function for uploading revit file to forge bucket ...")
    print(f"Uploading file {file_path} for Job {job_name} ...")

    search_query = { "name": job_name}
    
    try:
        job_order = get_job_order(search_query)
        if not job_order:
            err_msg = f"JOB with name {job_name} does not exist."
            raise ValueError(err_msg)

        box_file_id = job_order["upload_file_id"]
        if not box_file_id or box_file_id == '':
            err_msg = f"JOB with name {job_name} does not have a revit file Uploaded to BOX."
            raise ValueError(err_msg)

        job_name = job_name.replace(" ", "")
        update_cols = { "$set": { "forge_status": "UPLOAD_INITIATED" } }

        update_job_order(search_query, update_cols)

        response = data_provider.login()
        print(f"Forge login response = {response} ...")
        access_token = response["access_token"]

        # forge_bucket_name = f"{round(time.time() * 1000)}_{job_name}"
        forge_bucket_name = f"{job_name}"
        try:
            bucket_details = data_provider.get_bucket_details(forge_bucket_name, access_token)
            if bucket_details:
                data_provider.delete_bucket_details(forge_bucket_name, access_token)
                forge_bucket_name = f"{forge_bucket_name}_1"
        except Exception as ex:
            print(f"Ignoring Error {str(ex)}")

        response = data_provider.create_bucket(forge_bucket_name, access_token)
        
        print(f"Forge create bucket response = {response} ...")

        response = data_provider.upload_revit_file(forge_bucket_name, file_path.strip(), box_file_id, access_token)

        urn = response['objectId']

        print(f"Forge File upload response = {response} ... doc_id {urn}")
        update_cols = { 
            "$set": { 
                "forge_status": "FORGE_UPLOAD_SUCCEEDED",
                "forge_bucket_name": response["bucketKey"],
                "forge_doc_id": urn
            } 
        }

        update_job_order(search_query, update_cols)

        data_provider.register_viewer_services(urn, access_token)

        print(f"Forge register ui services response = {response} ... doc_id {urn}")
        update_cols = { 
            "$set": { 
                "forge_status": "FORGE_UI_SERVICES_ACTIVE"
            } 
        }
        update_job_order(search_query, update_cols)

    except Exception as ex:
        print(f"Error {str(ex)}")
        update_cols = { "$set": { "forge_status": "FORGE_UPLOAD_FAILED", "error_message": f"{str(ex)}" } }
        update_job_order(search_query, update_cols)

    
@celery_app.task(queue="forge_queue")
def revit_export(job_name):
    from src.extensions import data_provider
    from src.providers.MongoProvider import update_job_order, get_job_order,datetime_format
    from src.api.box_api import box_upload_table,box_download

    print("Starting background function for exporting revit file to Forge Bucket")
    print(f"Exporting to Excel file for Job {job_name} ...")

    search_query = { "name": job_name}
    
    try:
        job_order = get_job_order(search_query)
        if not job_order:
            err_msg = f"JOB with name {job_name} does not exist."
            raise ValueError(err_msg)

        job_name = job_name.replace(" ", "")
        update_cols = { "$set": { "export_status": "EXPORT_STARTED" } }

        update_job_order(search_query, update_cols)

        response = data_provider.login()
        print(f"Forge login response = {response} ...")
        access_token = response["access_token"]
        print()
        urn = job_order["forge_doc_id"]

        res = data_provider.getMetadata(urn, access_token)
        print(f"Metadata response {res} ")
        print()
        guid = res["data"]["metadata"][0]["guid"]
        hierarchy = data_provider.getHierarchy(urn, guid, access_token)
        # print(f"Hierarch response {hierarchy} ")
        print()

        properties = data_provider.getProperties(urn, guid, access_token)
        # print(f"Properties response {properties} ")
        print()

        tables = data_provider.prepareRawData(hierarchy, properties)
        
        
        #RECORDS_PATH = "/tmp/"
        #filepath = os.path.join(RECORDS_PATH, "tables.json")

        #with open(filepath, 'w') as outfile:
            #json.dump(tables, outfile)
        
        box_details = box_upload_table(tables, job_name.replace(" ", ""), "export_json")

        update_cols = { 
            "$set": { 
                "export_status": "EXPORT_JSON_SUCCEEDED",
                "json_file_id": box_details["file_id"],
                "json_file_name":box_details["file_name"]
            } 
        }

        download_url = box_download(box_details["file_id"])
        update_cols["$set"]["json_url"] = download_url
        update_job_order(search_query, update_cols)

    except Exception as ex:
        print(f"Error {str(ex)}")
        update_cols = { "$set": { "export_status": "EXPORT_FAILED", "error_message": f"{str(ex)}" } }
        update_job_order(search_query, update_cols)
