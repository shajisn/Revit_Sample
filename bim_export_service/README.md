# Backend application to generate estimates from Forge revit files 

## Docker start
docker-compose up

## Set up.

Ccreate a new python virtual environment, and install the python packages

```bash
pip install -r requirements.txt
```

## Running the example.

### 1. Start a celery worker.
You'll need a worker to get things done, run the following command in a separate terminal tab:

### Inspecting celery queues
celery -A proj inspect active_queues  # Get a list of queues that workers consume


```bash
celery -A celery_worker.celery_app worker -Q forge_queue --concurrency 1 -P solo 
```

### 3. Start the app.

Open a new terminal tab and start the flask app:

```bash
python ./run.py
```
