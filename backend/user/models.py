from flask import Flask , jsonify ,request, session
import uuid
from passlib.hash import pbkdf2_sha256
from app import db
from datetime import datetime , timedelta
import jwt
from application import app
from werkzeug.security import generate_password_hash, check_password_hash


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
            "role": "user",
            "account_created":datetime.now()
        }

        token = jwt.encode({'name':user["name"],'email':user["email"],'exp': datetime.utcnow() + timedelta(minutes=30)},app.secret_key)
        

        if db.users.find_one({"email":user["email"]}):
            return {"message":"email already exists"} , 409

        if '@gmail.com' not in user["email"]:
            return {"message":"invalid email"} , 422

        user["password"] = generate_password_hash(user["password"])

        db.users.insert_one(user)

        return jsonify({"userId":user["_id"],"token":token.decode('UTF-8'),"userName":user["name"]}) , 200
    


    def verifyUser(self,data):
        print(f'Checking for user in database . . . for {data["email"]}')
        user = db.users.find_one({"email":data["email"]})

        # test = pbkdf2_sha256.decode(user["password"])
        # print('This: '+user["password"])
        hash =  user["password"]
        if( check_password_hash(hash,data["password"]) ):
            print("Password Matched!")
        else:
            user = None

        if user:
            token = jwt.encode({'name':user['name'],'email':user['email'],'exp': datetime.utcnow() + timedelta(minutes=30)},app.secret_key)
            return jsonify({ "userId":user["_id"],"token":token.decode('UTF-8'),"userName":user["name"] }) , 200
        else:
            return jsonify({"message":"no such user"}) , 404
            

    def returnUserData(self,userId):
        print(f'Fetching user data for id {userId}')
        user =  db.users.find_one({"_id":userId})
        if not user:
            return jsonify({'message':'No such user found!'}) , 404
        else:
            send_data = {
               "userName": user["name"],
               "userEmail": user["email"],
               "userRole": user["role"],
               "accountDate": user["account_created"]
            }
            return jsonify(send_data) , 200

