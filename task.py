import pymongo
import pickle
from datetime import datetime
import asyncio
import requests

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
        data = {
            "taskid":int(self.tid),
            "status":"SCHEDULED",
            "time_delay":self.seconds,
            "url":self.url,
            "ref":ref
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
        if data["status"] == "RUNNING":
            result = requests.get(self.url)
            if(result.status_code == 200):
                db.schedular.update_one({"taskid":self.tid},{"$set":{"status":"COMPLETED"}})
                print(f'Task {self.tid} COMPLETED at : {datetime.now().time()}')
            else:
                db.schedular.update_one({"taskid":self.tid},{"$set":{"status":"FAILED"}})
                print(f'Task {self.tid} FAILED at : {datetime.now().time()}')
    
    
    async def intitialize(self):
        print(f'Task {self.tid} initialize() called at : {datetime.now().time()}')
        self.test = asyncio.create_task(self.scheduleTask())
        await self.test

    async def cancelTask(self):
        result = self.test.cancel()
        try:
            await result
        except asyncio.CancelledError:
            print(f'{self.tid} task is cancellation confirmed!')
            raise