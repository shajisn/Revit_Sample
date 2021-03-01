from src.providers.BoxProvider import make_client
from src.providers.MongoProvider import init_job_order, update_job_order, get_job_order,datetime_format
from src.app import settings
from flask import request
import io
import datetime
import json
import os, connexion


def box_upload(box_file, job_name, file_name):
    try:
        print(f"started uploading the file to the BOX folder")
        
        app_user_client = make_client()
        stream = box_file.stream.read()
        
        # folder id, user id in config.json ? 
        folder_id = '130954394162'
        new_filename = job_name + "_" + file_name
        uploaded_file = app_user_client.folder(folder_id).upload_stream(io.BytesIO(stream), new_filename)
        # print(f'File {uploaded_file.name} uploaded to Box with BOX ID {uploaded_file.id}')
        # return {"file_id": '775524039706', "file_name": new_filename}
        return {"file_id": uploaded_file.id, "file_name": uploaded_file.name}
    except Exception as e:
        print(f"BOX UPLOAD ERROR: {str(e)}")

        return {'status': 'Internal Server Error', 'message': 'Failed to upload file to the server',
                'error': str(e)}, 500



def box_download(file_id):
    try:
        print(f"Getting download URL for specific file using file id")
        app_user_client = make_client()
        download_url = app_user_client.file(file_id).get_download_url()

        return download_url
    except Exception as e:
        print(f"File download from box folder failed: {str(e)}")

        return {'status': 'Internal Server Error', 'message': 'Failed to download file to the server',
                'error': str(e)}, 500

    
   
def list_all_items():
    print(f"listing all the items in the folder")
    app_user_client = make_client()
    folder_id = '130954394162'
    items = app_user_client.folder(folder_id).get_items()
    data_list = []
    print(f"items= {items}")
    for item in items:
        print(f"item = {item}")
        data_dic = {"file_id":item.id,
                    "file_name":item.name}
                    
        data_list.append(data_dic)
    return data_list



def delete_all_items():
    try:
        print(f"Deleting all files from the BOX folder")
        
        app_user_client = make_client()
        
        # folder id, user id in config.json ? 
        folder_id = '130954394162'
        items = app_user_client.folder(folder_id).get_items()
        for item in items:
            print('{0} {1} is named "{2}"'.format(item.type.capitalize(), item.id, item.name))
            ret = item.delete()
            print(f"Delete {item.name} return {ret} ")
        print("Delete operation completed ...")
    except Exception as e:
            #print("ERROR: Failed to save '{}' to: {}".format(filename, folder_id))
            print(f"ERROR: {str(e)}")
            return {'status': 'Internal Server Error', 'message': 'Failed to delete files',
                    'error': str(e)}, 500

def delete_item(file_id):
    try:
        print(f"Deleting all files from the BOX folder")
        
        app_user_client = make_client()
        file_info = app_user_client.file(file_id).delete()
       
        print(f"Delete {file_info.name} return {ret} ")
            
        print("Delete operation completed ...")
    except Exception as e:
            #print("ERROR: Failed to save '{}' to: {}".format(filename, folder_id))
            print(f"ERROR: {str(e)}")
            return {'status': 'Internal Server Error', 'message': 'Failed to delete file',
                    'error': str(e)}, 500

def box_upload_table(table, job_name, file_name):
    try:
        print(f"started uploading the file to the BOX folder")
        
        app_user_client = make_client()
        stream = json.dumps(table).encode('utf-8')
        
        # folder id, user id in config.json ? 
        folder_id = '130954394162'
        new_filename = job_name + "_" + file_name
        uploaded_file = app_user_client.folder(folder_id).upload_stream(io.BytesIO(stream), new_filename)
        # print(f'File {uploaded_file.name} uploaded to Box with BOX ID {uploaded_file.id}')
        # return {"file_id": '775524039706', "file_name": new_filename}
        return {"file_id": uploaded_file.id, "file_name": uploaded_file.name}
    except Exception as e:
        print(f"BOX UPLOAD ERROR: {str(e)}")

        return {'status': 'Internal Server Error', 'message': 'Failed to upload file to the server',
                'error': str(e)}, 500


def download_file():
    file_id = connexion.request.values["file_id"]
    
    try:
        print(f"Getting download URL for specific file using file id")
        app_user_client = make_client()
       
        download_url = app_user_client.file(file_id).get_download_url()
           
        return {"download_url":download_url}
    except Exception as e:
        print(f"File download from box folder failed: {str(e)}")

        return {'status': 'Internal Server Error', 'message': 'Failed to download file to the server',
                'error': str(e)}, 500
    

