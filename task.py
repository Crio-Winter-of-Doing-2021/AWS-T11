import pymongo
import pickle
from datetime import datetime
import asyncio
import requests
import json
from bson.json_util import dumps

obj=pymongo.MongoClient()
db=obj.scheduler
taskDict = {}

class Task:

    def __init__(self,url,seconds,idReq):
        self.url = url
        self.seconds = seconds
        self.tid = idReq
        self.test = None
        self.addInDb()
        
    def addInDb(self):
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
            "status_code":""
        }
        db.scheduler.insert_one(data) 
        print(f'Task {self.tid} ADDED at : {datetime.now().time()}')

    async def scheduleTask(self):

        db.scheduler.update_one({'taskid':self.tid},{"$set":{'status':'RUNNING'}})
        
        try:
            await asyncio.sleep(self.seconds)
        except asyncio.CancelledError:
            print(f'{self.tid} task is cancellation confirmed!')
            raise

        data = db.scheduler.find_one({"taskid":self.tid})
        print(f'Status check for {self.tid} !')
        if data["status"] == "RUNNING":
            result = requests.get(self.url)
            if(result.status_code == 200):
                db.scheduler.update_one({"taskid":self.tid},{"$set":{"status":"COMPLETED"}})
                print(result.json())
                db.scheduler.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                print(f'Task {self.tid} COMPLETED at : {datetime.now().time()}')
            else:
                db.scheduler.update_one({"taskid":self.tid},{"$set":{"status":"FAILED"}})
                db.scheduler.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                print(f'Task {self.tid} FAILED at : {datetime.now().time()}') 
    
    
    async def intitialize(self):
        print(f'Task {self.tid} initialize() called at : {datetime.now().time()}')
        test = asyncio.create_task(self.scheduleTask())
        print(type(test))
        taskDict[self.tid] = [test,self]
        try:
            await test
        except asyncio.CancelledError:
            print("In initialize task : ")

    def getStatus(self):
        data = db.scheduler.find_one({"taskid":self.tid})
        return data['status']


# Functions part

def CreateLamdaTask(url,delay=0):
    try:
        no_tasks = db.scheduler.find().count()
        new_id = no_tasks + 1
        t = Task(url,int(delay),new_id)
        asyncio.run(t.intitialize())
        return json.dumps(new_id)
    except Exception as e:
        print(e)
        return str(e)


def CancelTask(taskIDcancel):
    try:
        task = db.scheduler.find_one({'taskid':int(taskIDcancel)})
        if(task == None):
            return f"No task with id: {taskIDcancel}"
        if(task['status']=='COMPLETED'):
            return f'Task {task["taskid"]} already completed!'
        elif(task['status']=='FAILED'):
            return f'Task {task["taskid"]} already failed!'
        else:
            # print(dir(taskDict[task['taskid']]))
            taskDict[task['taskid']].cancel()
            print('CHECK: ',taskDict[task['taskid']].cancelled())
            db.scheduler.update_one({'taskid':self.tid},{"$set":{'status':'CANCELLED'}})
            return f'Task {task["taskid"]} is successfully canceled!'
    except Exception as e:
        print(e)
        return str(e)

def getTaskStatus(taskid):
    try:
        data = db.scheduler.find_one({"taskid":int(taskid)})
    except Exception as e:
        print(e)
        return e
    if data != None:
        return {"Status":data['status']}
    else:
        return 'No such task found!'


def getAllTask(statusOf=None):
    data = db.scheduler.find()
    if(statusOf == None):
        lst = list(data)
        # print(lst)
        jsonFromat = dumps(lst)
        jsonData = json.dumps(jsonFromat)
        ret = json.loads(jsonFromat)
        # print(type(ret))
        return ret
    else:
        lst = ['SCHEDULED','RUNNING','COMPLETED','FAILED','CANCELLED']
        try:
            if str(statusOf).upper() in lst:
                data = db.scheduler.find({"status":statusOf})
                lst = list(data)
                jsonFromat = dumps(lst)
                return jsonFromat
        except Exception as e:
            return e
        else:
            return 'NO SUCH STATUS'


def reintializeTask(taskID,delay_val):
    # print(taskDict)
    ret_taskObject = taskDict[taskID][1]
    task_Ref = taskDict[taskID][0]
    task_Ref.cancel()
    print(type(ret_taskObject))
    ret_taskObject.seconds = delay_val
    db.scheduler.update_one({"taskid":taskID},{"$set":{"time_delay":delay_val}})
    asyncio.run(ret_taskObject.intitialize())
    return 'check'

    

# def run(corutine):
#     try:
#         corutine.send(None)
#     except StopIteration as e:
#         return e.value