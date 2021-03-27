class Auth {
  constructor() {
    this.authenticated = false;
    this.userName = "";
    this.userId = "";
  }

  login(userName, userId) {
    try {
      let data = JSON.parse(localStorage.getItem("login"));
      if (data["login"]) {
        this.authenticated = true;
        this.userId = userId;
        this.userName = userName;
        console.log("User logged in : "+this.userName);
      } else this.authenticated = false;
    } catch (err) {
      this.authenticated = false;
    }
  }

  logout(cb) {
    try {
      localStorage.clear();
      this.userId = "";
      this.userName = "";
      cb();
    } catch (err) {
      console.log(err, " with logout in auth!");
    }
    this.authenticated = false;
    
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getUserName() {
    return this.userName;
  }

  getUserId() {
    return this.userId;
  }
}

export default new Auth();
