from flask import Flask , jsonify ,request, session
import uuid
from passlib.hash import pbkdf2_sha256
from app import db
from datetime import datetime , timedelta
import jwt
from application import app


class User:

    def create_jwt(self,user):
        print('test')

    def signup(self):
        print(request.get_json())

        user = {
            "_id" : uuid.uuid4().hex,
            "name": request.get_json()['name'],
            "email": request.get_json()['email'],
            "password": request.get_json()['password'],
        }

        token = jwt.encode({'name':user["name"],'email':user["email"],'exp': datetime.utcnow() + timedelta(minutes=30)},app.secret_key)
        

        if db.users.find_one({"email":user["email"]}):
            return {"message":"email already exists"} , 409

        if '@gmail.com' not in user["email"]:
            return {"message":"invalid email"} , 422

        user["password"] = pbkdf2_sha256.encrypt(user["password"])

        db.users.insert_one(user)

        return jsonify({"userId":user["_id"],"token":token.decode('UTF-8'),"userName":user["name"]}) , 200
    


    def verifyUser(self,data):
        print(f'Checking for user in database . . . for {data["email"]}')
        user = db.users.find_one({"email":data["email"]})

        if user:
            token = jwt.encode({'name':user['name'],'email':user['email'],'exp': datetime.utcnow() + timedelta(minutes=30)},app.secret_key)
            return jsonify({ "userId":user["_id"],"token":token.decode('UTF-8'),"userName":user["name"] }) , 200
        else:
            return jsonify({"message":"no such user"}) , 404
            


