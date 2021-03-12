import asyncio
from flask import Flask,request
import requests
import pymongo
from datetime import datetime
import pickle 
from task import Task
import json
from bson.json_util import dumps

app = Flask(__name__)

obj=pymongo.MongoClient()
db=obj.scheduler

# return monogodb cursor
def getAllTask(statusOf=None):
    data = db.schedular.find()
    if(statusOf == None):
        lst = list(data)
        jsonFromat = dumps(lst)
        return jsonFromat
    else:
        data = db.schedular.find({"status":statusOf})
        lst = list(data)
        jsonFromat = dumps(lst)
        return jsonFromat


@app.route('/create_task',methods=['POST'])
def create_task():
    if request.method == 'POST':
        if(request.form):   
            data = request.form
            t = Task(data["url"],int(data["delay"]))
            asyncio.run(t.intitialize())
            return json.dumps(t.tid)
    else:
        return "ERROR!"


@app.route('/cancel_task',methods=['POST'])
def cancel_task():
    if(request.form):
        data=request.form.to_dict()
        task = db.schedular.find_one({'taskid':int(data['taskid'])})
        if task == None:
            return f"No task with id: {data['taskid']}"
        if(task['status']=='COMPLETED'):
            return f'Task {task["taskid"]} already completed!'
        elif(task['status']=='FAILED'):
            return f'Task {task["taskid"]} already failed!'
        else:
            t=pickle.loads(task['ref'])
            t.cancelTask()
            db.schedular.update_one({'taskid':task['taskid']},{"$set":{'status':'CANCELLED'}})
            return f'Task {task["taskid"]} is successfully canceled!'

@app.route('/check_status',methods=['POST'])
def checkStatus():
    if(request.form):
        data = request.form.to_dict()
        task = db.schedular.find_one({'taskid':int(data['taskid'])})
        if task == None:
            return f"No task with id: {data['taskid']}"
        else:
            return str(task['status'])

@app.route('/getAllTask/<statusOf>',methods=['GET'])
def get_all_task_by_status(statusOf):
    lst = ['SCHEDULED','RUNNING','COMPLETED','FAILED','CANCELLED']
    if str(statusOf).upper() in lst:
        ret = getAllTask(str(statusOf).upper())
        return ret
    else:
        return 'NO SUCH STATUS'

@app.route('/getAllTask',methods=['GET'])
def get_all_task():
    ret = getAllTask()
    return ret

@app.route('/')
def home():
  return 'hey!'

if __name__ == '__main__':
  app.run(debug=True,port=3000,threaded=True)



