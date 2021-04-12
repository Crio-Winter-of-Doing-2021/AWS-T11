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

    def __init__(self,task_data,new_id):
        self.name = task_data["taskName"]
        self.url = task_data["taskurl"]
        self.seconds = int(task_data["delay"])
        self.tid = new_id
        self.test = None
        self.userId = task_data["userId"]
        if len(task_data["taskParameters"]) != 0:
            self.havePara = True
        else:
            self.havePara = False
        self.taskParameters = task_data["taskParameters"]
        self.retry_count = task_data["retry_count"]
        self.retry_duration = task_data["retry_duration"]
        self.failed_count = 0
        self.addInDb()
        
        
    def addInDb(self):
        ref = pickle.dumps(self)
        d = datetime.now()
        data = {
            "taskName":self.name,
            "taskid":int(self.tid),
            "status":"SCHEDULED",
            "time_delay":int(self.seconds),
            "url":self.url,
            "ref":ref,
            "ret_message":"",
            "time_created":d,
            "last_modified":d,
            "user_id":self.userId,
            "status_code":"",
            "url_params":self.taskParameters,
            "exec_error":"",
            "failed_count":self.failed_count,
            "retry_count":self.retry_count,
            "retry_duration":self.retry_duration
        }
        db.scheduler.insert_one(data) 
        print(f'Task {self.tid} ADDED at : {datetime.now().time().strftime("%H:%M:%S")}')

    async def scheduleTask(self):
        
        db.scheduler.update_one({'taskid':self.tid},{"$set":{'status':'SCHEDULED'}})
        
        try:
            print(f"Scheduled task! with id: {self.tid} ")
            if(self.failed_count > 0):
                await asyncio.sleep(self.retry_duration)
            else:
                await asyncio.sleep(self.seconds)
        except asyncio.CancelledError:
            print(f'{self.tid} task is cancellation confirmed!')
            raise

        
        data = db.scheduler.find_one({"taskid":self.tid})
        
        if data["status"] == "SCHEDULED":
            try:
                if(self.havePara):
                    self.addParameterToUrl()

                result = requests.get(self.url)
                db.scheduler.update_one({'taskid':self.tid},{"$set":{'status':'RUNNING'}})
                print(f'Running {self.tid} at : {datetime.now().time().strftime("%H:%M:%S")}')
                if(result.status_code == 200):
                    db.scheduler.update_one({"taskid":self.tid},{"$set":{"status":"COMPLETED"}})
                    # print(result.json())
                    db.scheduler.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                    print(f'Task {self.tid} COMPLETED at : {datetime.now().time().strftime("%H:%M:%S")}')
                else:
                    db.scheduler.update_one({"taskid":self.tid},{"$set":{"status":"FAILED"}})
                    db.scheduler.update_one({"taskid":self.tid},{"$set":{"ret_message":result.json()}})
                    print(f'Task {self.tid} FAILED at : {datetime.now().time().strftime("%H:%M:%S")}')

                    # performing retries
                    if self.retry_count > 0:
                        self.retry_count -= 1
                        self.failed_count += 1
                        db.scheduler.update_one({'taskid':self.tid},{"$set":{'status':'SCHEDULED',
                        "retry_count":self.retry_count,
                        "failed_count":self.failed_count}})
                        
                        loop = asyncio.get_event_loop()
                        print(f'Task {self.tid} retryTask() called at : {datetime.now().time().strftime("%H:%M:%S")}')
                        test = loop.create_task(self.scheduleTask())
                        taskDict[self.tid] = [test,self]
                        try:
                            await test
                        except asyncio.CancelledError:
                            print("In initialize task : ")

            except Exception as e:
                db.scheduler.update_one({"taskid":self.tid},{"$set":{"status":"FAILED","exec_error":e}})
                print(e)
    
    async def intitialize(self):
        print(f'Task {self.tid} initialize() called at : {datetime.now().time().strftime("%H:%M:%S")}')
        test = asyncio.create_task(self.scheduleTask())
        print(type(test))
        # db.taskRef.insert_one(data)
        taskDict[self.tid] = [test,self]
        try:
            await test
        except asyncio.CancelledError:
            print("In initialize task : ")
    

    def addParameterToUrl(self):
        for index , item in enumerate(self.taskParameters):
            if(index == 0):
                self.url += "?"
            else:
                self.url += "&"
            self.url += item["key"]
            self.url += "="
            self.url += item["value"]
                 
        print("In the required function: "+self.url)

      

    def getStatus(self):
        data = db.scheduler.find_one({"taskid":self.tid})
        return data['status']


# Functions part
# (url,delay=0,userId=0,params=None
def CreateLamdaTask(req_data):
    try:

        data = req_data
        print(data["taskParameters"])

        no_tasks = db.scheduler.find().count()
        new_id = no_tasks + 1

        t = Task(req_data,new_id)

        asyncio.run(t.intitialize())
        print(new_id)
        return new_id
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
            taskDict[task['taskid']][0].cancel()
            print('CHECK: ',taskDict[task['taskid']][0].cancelled())
            db.scheduler.update_one({'taskid':taskIDcancel},{"$set":{'status':'CANCELLED'}})
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
    print(f'Task {taskID} reinitialize() called at : {datetime.now().time().strftime("%H:%M:%S")}')
    taskObect = taskDict[taskID][1]
    task_Ref = taskDict[taskID][0]

    task_Ref.cancel()

    print(type(taskObect))

    taskObect.seconds = delay_val

    db.scheduler.update_one({"taskid":taskID},{"$set":{
        "time_delay":delay_val,
        "last_modified":datetime.now()
        }})

    asyncio.run(taskObect.intitialize())

    return 'Modified!'



    
def CheckStatus(taskid):
    task = db.scheduler.find_one({'taskid':int(taskid)})
    if task == None:
        return "No such task!"
    else:
        return task["status"]

# def run(corutine):
#     try:
#         corutine.send(None)
#     except StopIteration as e:
#         return e.value


#  Orchestator functions

