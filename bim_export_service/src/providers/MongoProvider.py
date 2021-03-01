import pymongo
import jsonify
from flask import request
import datetime

from src.app import settings

# Mongo instance creation
mongo_instance = pymongo.MongoClient(settings.mongo_url)
mongo_db = mongo_instance[settings.mongo_db_name]
mongo_coll = mongo_db[settings.mongo_coll_name]


def datetime_format():
    req_date = datetime.datetime.utcnow().strftime("%d-%m-%y - %H:%M")
    return req_date


def list_joborder():
    result_list = []
    result = mongo_coll.find()
    for i in result:
        i.pop("_id")
        result_list.append(i)
    print(f"Result = {result_list}")
    return result_list


def create_joborder():
    input = request.get_json()
    print(f"Input json - {input}")
    mongo_coll.insert_one(input)
    return {"Status": "inserted"}


def init_job_order(name, desc, file_name):
    current_datetime = datetime_format()
    input = {
        "name": name,
        "description": desc,
        "upload_file_id": "",
        "upload_file_name": file_name,
        "upload_status": "NOT_INITIATED",
        "revit_url": "",
        "forge_bucket_name": "",
        "forge_doc_id": "",
        "forge_status": "NOT_INITIATED",
        "export_status": "NOT_INITIATED",
        "json_file_id": "",
        "json_file_name": "",
        "json_url": "",
        "gracie_status": "NOT_INITIATED",
        "gracie_url": "",
        "created_time": current_datetime,
        "modified_time": "",
        "user_id": "",
        "error_message": "",
    }
    print(f"New JOB Input json - {input}")
    mongo_coll.insert_one(input)
    return {"Status": "inserted"}


def update_job_order(search_query, update_query):
    update_query["$set"]["modified_time"] = datetime_format()
    print(f"UPDATE JOB search json - {search_query} - Update json - {update_query}")
    mongo_coll.update_one(search_query, update_query)
    return {"Status": "updated"}


def clear_errormsg(search_query):
    result = mongo_coll.find(search_query)
    result_list = []
    for i in result:
        i.pop("_id")
        result_list.append(i)
    if len(result_list[0]["error_message"]) > 0:
        delete_query = {"$set": {"error_message": ""}}
        mongo_coll.update(search_query, delete_query)
    return {"Status": "cleared error msg"}


def get_job_order(search_query):
    print(f"GET JOB search json - {search_query}")
    job_order = mongo_coll.find_one(search_query)
    print(f"Result = {job_order}")
    if job_order:
        job_order.pop("_id")
    return job_order

def delete_job_order(search_query):
    print(f"Delete record of {search_query} ")
    mongo_coll.remove(search_query)
    return {"Status":"deleted"}
