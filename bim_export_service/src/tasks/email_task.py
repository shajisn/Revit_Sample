import random, time, os
import json
from src import celery_app


@celery_app.task(queue="email_queue")
def status_mail(message, subject):
    from src.utils.email_utils import send_mail
    try:
        response = send_mail(message_content=message, subject=subject)
        # return response
    except Exception as e:
        print(f"Celery email task error = {str(e)}")