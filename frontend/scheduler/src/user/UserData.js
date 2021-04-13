import React, { Component } from "react";
import "../css/App.css";
// import auth from './auth';

class UserData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userID: "",
      userEmail: "",
      userRole: "",
    };
  }

  componentDidMount() {
    try {
      let local_storage = JSON.parse(localStorage.getItem("login"));
      if (local_storage["login"]) {
        // var _name = local_storage["userName"];
        var _id = local_storage["userId"];
        // this.setState({ userName: _name, userId: _id });

        // console.log("TEST : ",auth.isAuthenticated());

        var send_data = { userId: _id };
        // console.log("this is send_data : ", send_data);
        var myHeader = new Headers();
        myHeader.append("Authorization", "Bearer " + local_storage["token"]);
        myHeader.append("Content-Type", "application/json");
        fetch("http://localhost:3000/user/details", {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          body: JSON.stringify(send_data),
          headers: myHeader,
        })
          .then(function (response) {
            if (response.status !== 200) {
              throw new Error("HTTP status : " + response.status);
            } else {
              return response.json();
            }
          })
          .then((res) => {
            var data = res;
            if(res["userRole"]==="admin"){
                var local_test = JSON.parse(localStorage.getItem("login"));
                local_test["Admin"] = true;
                // console.log("user set to admin!" , local_test["Admin"]) ;
                localStorage.setItem("login",JSON.stringify(local_test));
                // console.log(local_test);
              }
            this.setState({
              userName: data["userName"],
              userEmail: data["userEmail"],
              userRole: data["userRole"],
            });
            // console.log(data, " - fetched user DATA CHECK: ");
          })
          .catch((err) => console.log(err, " - in UserData.js"));
      } else console.log("failed test");
    } catch (err) {
      console.log(
        "No able to retrieve values from LocalStorage in UserData.js"
      );
    }
  }

  render() {
    return (
      <div className="DetailsContainer">
        <div id="UserDetailsBlock">
          <h3>{this.state.userName}</h3>
          <p>({this.state.userRole})</p>
          <h4>{this.state.userEmail}</h4>
        </div>
      </div>
    );
  }
}

export default UserData;
