import auth from "./auth";

function Logout(props) {
  return (
    <button
      onClick={() => {
        auth.logout(() => {
          localStorage.clear();
          props.history.push("/");
        });
      }}
    >
      Logout
    </button>
  );
}

export default Logout;
