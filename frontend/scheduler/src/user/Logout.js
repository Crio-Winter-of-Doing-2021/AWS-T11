import auth from "./auth";
import '../css/App.css'

function Logout(props) {
  return (
    <button id="LogoutButton"
      onClick={() => {
        auth.logout(() => {
          localStorage.clear();
          props.history.push("/");
        });
      }}
    >
      Log out
    </button>
  );
}

export default Logout;
