import pymongo
import pickle
from datetime import datetime
import asyncio
import requests
import json
from bson.json_util import dumps

obj=pymongo.MongoClient()
db=obj.scheduler

class Task:

    def __init__(self,url,seconds):
        self.url = url
        self.seconds = seconds
        self.tid = 0
        self.test = None
        self.addInDb()
        
    def addInDb(self):
        self.tid = db.schedular.find().count() + 1
        ref = pickle.dumps(self)
        d = datetime.now()
        data = {
            "taskid":int(self.tid),
            "status":"SCHEDULED",
            "time_delay":int(self.seconds),
            "url":self.url,
            "ref":ref,
            "ret_message":"",
            "time_created":d,
            "last_modified":d,
            "user_id":"",
        }
        db.schedular.insert_one(data) 
        print(f'Task {self.tid} ADDED at : {datetime.now().time()}')

    async def scheduleTask(self):

        db.schedular.update_one({'taskid':self.tid},{"$set":{'status':'RUNNING'}})
        
        try:
            await asyncio.sleep(self.seconds)
        except asyncio.CancelledError:
            print(f'{self.tid} task is cancellation confirmed!')
            raise

        data = db.schedular.find_one({"taskid":self.tid})

        if data['status'] == 'CANCELLED':
            print(f'Task {self.tid} Cancelled!')
            return

        print(f'Status check for {self.tid} !')
        if data["status"] == "RUNNING":
            result = requests.get(self.url)
            if(result.status_code == 200):
                db.schedular.update_one({"taskid":self.tid},{"$set":{"status":"COMPLETED"}})
                print(result.json())
                db.schedular.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                print(f'Task {self.tid} COMPLETED at : {datetime.now().time()}')
            else:
                db.schedular.update_one({"taskid":self.tid},{"$set":{"status":"FAILED"}})
                db.schedular.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                print(f'Task {self.tid} FAILED at : {datetime.now().time()}')
    
    
    async def intitialize(self):
        print(f'Task {self.tid} initialize() called at : {datetime.now().time()}')
        test = asyncio.create_task(self.scheduleTask())
        await test

    def getStatus(self):
        data = db.schedular.find_one({"taskid":self.tid})
        return data['status']


def CreateLamdaTask(url,delay=0):
    try:
        t = Task(url,int(delay))
        asyncio.run(t.intitialize())
        return json.dumps(t.tid)
    except Exception as e:
        print(e)
        return str(e)


def run(corutine):
    try:
        corutine.send(None)
    except StopIteration as e:
        return e.value

def CancelTask(taskIDcancel):
    try:
        task = db.schedular.find_one({'taskid':int(taskIDcancel)})
        if(task == None):
            return f"No task with id: {taskIDcancel}"
        if(task['status']=='COMPLETED'):
            return f'Task {task["taskid"]} already completed!'
        elif(task['status']=='FAILED'):
            return f'Task {task["taskid"]} already failed!'
        else:
            db.schedular.update_one({'taskid':task['taskid']},{"$set":{'status':'CANCELLED'}})
            return f'Task {task["taskid"]} is successfully canceled!'
    except Exception as e:
        print(e)
        return str(e)

def getTaskStatus(taskid):
    try:
        data = db.schedular.find_one({"taskid":int(taskid)})
    except Exception as e:
        print(e)
        return e
    if data != None:
        return {"Status":data['status']}
    else:
        return 'No such task found!'


def getAllTask(statusOf=None):
    data = db.schedular.find()
    if(statusOf == None):
        lst = list(data)
        print(lst)
        jsonFromat = dumps(lst)
        jsonData = json.dumps(jsonFromat)
        return jsonData
    else:
        lst = ['SCHEDULED','RUNNING','COMPLETED','FAILED','CANCELLED']
        try:
            if str(statusOf).upper() in lst:
                data = db.schedular.find({"status":statusOf})
                lst = list(data)
                jsonFromat = dumps(lst)
                return jsonFromat
        except Exception as e:
            return e
        else:
            return 'NO SUCH STATUS'