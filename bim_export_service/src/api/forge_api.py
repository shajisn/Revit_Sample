import os, connexion
from flask import request
from werkzeug.utils import secure_filename

from src.extensions import data_provider
from src.providers.MongoProvider import init_job_order, update_job_order, get_job_order, datetime_format, clear_errormsg, delete_job_order
from src.tasks.async_task import forge_upload, revit_export
from src.tasks.email_task import status_mail
from src.providers.ForgeProvider import ForgeProvider
from src.api.box_api import box_upload, box_download, delete_item

RECORDS_PATH = "/tmp/"

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt','csv'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def dummy():
    return "Ok"

# @inject
def forge_login():
    try:
        return data_provider.login()
    except Exception as err:
        print("Error: " + err)
        return {"message": err.message}

def create_bucket(name, token):
    try:
        return data_provider.create_bucket(name, token)
    except Exception as err:
        print("Error: " + err)
        return {"message": err.message}

def get_bucket_details(name, token):
    try:
        return data_provider.get_bucket_details(name, token)
    except Exception as err:
        print("Error: " + err)
        return {"message": err.message}

def file_upload():
    if connexion.request.method == 'OPTIONS':
        print(f"Ignoring OPTIONS HTTP call ...")
        return {'status': 'OK', 'message': 'OK'}, 201

    try:
        print(f"Initiated file upload API...")
        record = connexion.request.files['revitFile']
        job_name = connexion.request.values['jobname']
        description = connexion.request.values['description']
        is_update = connexion.request.values['is_update']
        print(f"is_update = {is_update}")

        if not job_name:
            err_msg = f"The field [jobname] is mandatory. Please provide a name for the job"
            print(err_msg)
            return {'status': 'Missing Parameters Error', 'message': err_msg,
                    'error': err_msg}, 422

        print(f"Uploading file {record.filename} for Job {job_name} and description={description} ...")
        filename = secure_filename(record.filename)

        search_query = { "name": job_name}
        job_order = get_job_order(search_query)
        if is_update == "false" and job_order:
            err_msg = f"JOB with name {job_name} already exist."
            print(err_msg)
            return {'status': 'Internal Server Error', 'message': err_msg,
                    'error': err_msg}, 409
        if not job_order:
            is_update = "false"
        
        if is_update == "true":
                print(f"Updating Job {job_name} ...")
                upload_file_id = job_order['upload_file_id']
                delete_item(upload_file_id)
                if len(job_order["json_file_id"])>0:
                    json_file_id =  job_order["json_file_id"]
                    delete_item(json_file_id)
                delete_job_order(search_query)
        
        if 'revitFile' in connexion.request.form and connexion.request.form['revitFile']:
            filename = secure_filename(connexion.request.form['revitFile'])
        try:
            init_job_order(job_name, description, filename)
            box_details = box_upload(record, job_name.replace(" ", ""), filename)
            update_query = {
                "$set": {
                    "upload_file_id": box_details["file_id"],
                    "upload_status":"FILE_UPLOADED",
                    "upload_file_name": box_details["file_name"]
                }
            }
            download_url = box_download(box_details["file_id"])
            update_query["$set"]["revit_url"] = download_url
            print(f"update query = {update_query}")
            update_job_order(search_query, update_query)

            try:
                print(f"Post async Forge Upload API...")
                #response=clear_errormsg(query)
                #print(response)
                task = forge_upload.apply_async(args=[job_name, filename],  queue='forge_queue')
                task_id = task.id
                print(f"Task Started {task_id}")
            except Exception as e:
                update_query = { "$set": { "upload_status": "UPLOAD_FAILED", "error_message": f"{str(e)}" } }
                update_job_order(search_query, update_query)
                raise Exception(e)
            
            return {'status': 'Created', 'message': 'File uploaded successfully !', 'location': filename}, 201
        except Exception as ex1:
            print(f"Error {str(ex1)}")
            update_query = { "$set": { "upload_status": "UPLOAD_FAILED", "error_message": f"{str(ex1)}" } }
            update_job_order(search_query, update_query)
            raise Exception(ex1)

    except Exception as ex:
        print(f"Error {str(ex)}")
        return {'status': 'Internal Server Error', 'message': f"Error {str(ex)}",
                    'error': str(ex)}, 500


def export_excel(job_name):
    if connexion.request.method == 'OPTIONS':
        print(f"Ignoring OPTIONS HTTP call ...")
        return {'status': 'OK', 'message': 'OK'}, 201
    try:
        if not job_name and connexion.request.is_json:
            input = connexion.request.get_json()
            job_name = input["job_name"]

        search_query = { "name": job_name}
        job_order = get_job_order(search_query)
        if not job_order:
            err_msg = f"JOB with name {job_name} does not exist."
            print(err_msg)
            return {'status': 'Internal Server Error', 'message': err_msg,
                    'error': err_msg}, 404

        update_cols = { "$set": { "export_status": "EXPORT_INITIATED" } }
        print(f"update query = {update_cols}")
        update_job_order(search_query, update_cols)
        
        try:
            print(f"Post async Forge Export API...")
            response = clear_errormsg(search_query)
            print(response)
            task = revit_export.apply_async(args=[job_name],  queue='forge_queue')
            task_id = task.id
            print(f"Task Started {task_id}")
            #res = revit_export(job_name)
            #print(f"{res}")
        except Exception as e:
            update_query = { "$set": { "export_status": "EXPORT_FAILED", "error_message": f"{str(e)}" } }
            update_job_order(search_query, update_query)
            raise Exception(e)

        return {'status': 'Ok', 'message': 'Export action started successfully !' }, 201

    except Exception as ex:
        print(f"Error {str(ex)}")
        return {'status': 'Internal Server Error', 'message': f"Error {str(ex)}",
                    'error': str(ex)}, 500
        

                    
def sent_mail():
    print(f"Sending email...")
    subject = connexion.request.values["subject"]
    email_content = connexion.request.values["content"]
    print(f"Inside the sent mail function Subject = {subject}, Content = {email_content}")
    try:
        task = status_mail.apply_async(args=[email_content, subject],  queue='email_queue')
        task_id = task.id
        print(f"Email Task Started {task_id}")
        return {'status': 'Ok', 'message': 'Mail sent successfully !' }, 201
    except Exception as ex:
        print(f"Error {str(ex)}")
        return {'status': 'Internal Server Error', 'message': f"Error {str(ex)}",
                    'error': str(ex)}, 500 

