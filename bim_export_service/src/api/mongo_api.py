from src.providers.MongoProvider import list_joborder,create_joborder

def list_JO():
    try:
        return list_joborder()
    except Exception as err:
        print("Error: " + err)
        return {"message": err.message}

def create_JO():
    try:
        return create_joborder()
    except Exception as err:
        print("Error: " + err)
        return {"message": err.message}