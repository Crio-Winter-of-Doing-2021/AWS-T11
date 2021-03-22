from flask import Flask,request
from flask_cors import CORS
from flask import jsonify
import requests
import task
import json

app = Flask(__name__)
CORS(app)

@app.route('/create_task',methods=['POST'])
def create_task():
    # return {'message':'test'}
    if request.method == 'POST':
        if(request.form):   
            data = request.form
            url = data["url"]
            delay = data["delay"]
            ret_task_id = task.CreateLamdaTask(url,delay)
            return {'message':ret_task_id}
        else:
            data = request.json
            print(data)
            url = data["taskurl"]
            delay = data["delay"]
            ret_task_id = task.CreateLamdaTask(url,delay)
            return {'message':ret_task_id}
    else:
        return {'message':'ERROR!'}


@app.route('/cancel_task',methods=['POST'])
def cancel_task():
    if(request.form):
        data=request.form.to_dict()
        task_id = data["taskid"]
        ret = task.CancelTask(int(task_id))
        return ret


@app.route('/modify_task',methods=['POST'])
def modify_task():
    if(request.form):
        data=request.form.to_dict()
        task_id = data["taskid"]
        delay_val = data["delay"]
        ret = task.reintializeTask(int(task_id),int(delay_val))
        return ret

@app.route('/check_status',methods=['POST'])
def checkStatus():
    if(request.form):
        data = request.form.to_dict()
        ret = task.getTaskStatus(data['taskid'])
        return ret

@app.route('/getAllTask/<statusOf>',methods=['GET'])
def get_all_task_by_status(statusOf):
    ret = task.getAllTask(statusOf)
    return ret


@app.route('/getAllTask',methods=['GET'])
def get_all_task():
    ret = task.getAllTask()
    return jsonify(ret)

@app.route('/')
def home():
  return 'hey!'

if __name__ == '__main__':
  app.run(debug=True,port=3000,threaded=True)



