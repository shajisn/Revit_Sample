from celery import Celery
from kombu import Queue

def make_celery(app_name=__name__):
    
    # from app import app
    from src.app import settings

    # backend = f'redis://:{settings.redis_secret}@{settings.redis_host}:{settings.redis_port}/0'
    # broker =f'redis://:{settings.redis_secret}@{settings.redis_host}:{settings.redis_port}/1'
    
    backend =f'redis://:@{settings.redis_host}:{settings.redis_port}/1'

    # backend = "redis://localhost:6379/1"
    # broker = backend.replace("1", "0")
    
    celery_app = Celery(app_name, backend=backend, broker=backend)
    # disable UTC to let Celery use local time
    celery_app.conf.enable_utc = True
    celery_app.conf["celery_imports"] = ("src.tasks.async_task", "src.tasks.email_task")
    celery_app.conf.task_routes = ([('src.tasks.async_task.*', {'queue': 'forge_queue'}), ('src.tasks.email_task.*',{'queue': 'email_queue'})])
    celery_app.autodiscover_tasks()

    celery_app.conf["broker_url"] = backend
    celery_app.conf["result_backend"] = backend
    celery_app.conf["accpet_content"] = ['application/json']
    celery_app.conf["task_serializer"] = 'json'
    celery_app.conf["result_serializer"] = 'json'
    celery_app.conf["task_acks_late"] = True
    celery_app.conf["task_default_queue"] = 'forge_queue'
    celery_app.conf["worker_send_task_events"] = True
    celery_app.conf["worker_prefetch_multiplier"] = 1
    celery_app.conf["broker_use_ssl"] =  True
    celery_app.conf["task_queues"] = (Queue("forge_queue"), Queue("email_queue"))

    # celery_app.conf["task_queues"] = (
    #     Queue(
    #         CELERY_QUEUE_DEFAULT,
    #         Exchange(CELERY_QUEUE_DEFAULT),
    #         routing_key=CELERY_QUEUE_DEFAULT,
    #     ),
    #     Queue(
    #         CELERY_QUEUE_OTHER,
    #         Exchange(CELERY_QUEUE_OTHER),
    #         routing_key=CELERY_QUEUE_OTHER,
    #     ),
    # )
    # celery_app.conf["task_routes"] = {
    #     'backend.core.tasks.debug_task': {
    #         'queue': 'default',
    #         'routing_key': 'default',
    #         'exchange': 'default',
    #     },
    #     'backend.core.tasks.debug_task_other': {
    #         'queue': 'other',
    #         'routing_key': 'other',
    #         'exchange': 'other',
    #     },
    # }
    celery_app.conf["task_default_exchange_type"] = 'direct'
    return celery_app

celery_app = make_celery()
