class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    let data = JSON.parse(localStorage.getItem("login"));
    if (data["login"]) this.authenticated = true;
    else this.authenticated = false;
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    try {
      localStorage.clear();
    } catch (err) {
      console.log(err, " with logout in auth!");
    }
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
