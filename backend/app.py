from application import app
import pymongo
from functools import wraps
from flask import jsonify ,request
import jwt

obj=pymongo.MongoClient()
db=obj.user_login_system

def login_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        try:
            token = request.headers.get("Authorization").split()[1]
            print(token)
        except:
            return jsonify({"message":"Token missing"})
        
        try:
            print(app.secret_key)
            data = jwt.decode(token,app.secret_key)
        except:
            return jsonify({"message":"Token not valid"})


        return f(*args,**kwargs)
    return decorated

if __name__ == '__main__':
    app.run(debug=True,port=3000,threaded=True)