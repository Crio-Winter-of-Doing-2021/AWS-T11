from flask import Flask , request , jsonify
from application import app
from user.models import User
import jwt
from datetime import datetime , timedelta
from app import login_required 
from functools import wraps

@app.route('/user/signup',methods=['POST'])
def signup():
    if(request.method == 'POST'):
        return User().signup()
    else:
        return {'message','not a post method'}


@app.route('/user/login',methods=['POST'])
def login():
    req_token = request.headers.get('Authorization')
    data = request.json
    print(req_token)

    return User().verifyUser(data)

    # return jsonify({'token':token.decode('UTF-8')}) , 200
    # print(data)

    # return {'message':'you there'} , 200
    

@app.route('/user/test',methods=['GET','POST'])
@login_required
def test():
    return {'message':'Logged In token is good'}