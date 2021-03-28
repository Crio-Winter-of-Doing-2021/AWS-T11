from flask import Flask,request , jsonify
from flask_cors import CORS
from flask import jsonify
import task
import json
from functools import wraps
import jwt


app = Flask(__name__)
app.secret_key = b'\x88\xa6\xd6\x7f,\xbb}\xf9\x7f=\xa4\x08\x99\x94q\xc3'
CORS(app)

from user import routes
from app import login_required

#######################
# Main functions 

@app.route('/create_task',methods=['POST'])
@login_required
def create_task():
    # return {'message':'test'}
    if request.method == 'POST':
        if(request.form):   
            data = request.form
            url = data["url"]
            delay = data["delay"]
            ret_task_id = task.CreateLamdaTask(url,delay)
            return {'message':ret_task_id} , 200
        else:
            data = request.json
            url = data["taskurl"]
            delay = data["delay"]
            userId = data["userId"]
            ret_task_id = task.CreateLamdaTask(url,delay,userId)
            return {'taskid':ret_task_id} , 200
    else:
        return {'message':'ERROR!'} , 400


@app.route('/cancel_task',methods=['POST'])
@login_required
def cancel_task():
    if(request.method == 'POST'):
        if(request.form):
            data=request.form.to_dict()
            task_id = data["taskid"]
            ret = task.CancelTask(int(task_id))
        else:
            data = request.json
            task_id = data["taskid"]
            ret = task.CancelTask(int(task_id))
        return ret , 200
    else:
        return {'message':'ERROR!'} , 404


@app.route('/modify_task',methods=['POST'])
@login_required
def modify_task():
    if request.method == 'POST':
         if(request.form):   
            data = request.form
            url = data["task_id"]
            delay = data["delay_val"]
            ret_task_id = task.reintializeTask(url,delay)
            return {'message':ret_task_id} , 200
         else:
            data = request.json
            print(data)
            url = data["task_id"]
            delay = data["delay_val"]
            ret_task_id = task.reintializeTask(url,delay)
            return {'message':ret_task_id} , 200
    else:
        return {'message':'ERROR!'} , 404

def ret_data(data):
    return jsonify({'message':data})

@app.route('/check_status',methods=['POST'])
@login_required
def checkStatus():
    if(request.form):
        data = request.form.to_dict()
        ret = task.getTaskStatus(data['taskid'])
        return 

@app.route('/getAllTask/<statusOf>',methods=['GET'])
@login_required
def get_all_task_by_status(statusOf):
    ret = task.getAllTask(statusOf)
    return ret


@app.route('/getAllTask',methods=['GET'])
@login_required
def get_all_task():
    ret = task.getAllTask()
    return jsonify(ret)

@app.route('/')
def home():
  return 'hey!' , 200




