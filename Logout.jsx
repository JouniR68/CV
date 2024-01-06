export default function Logout() {
  sessionStorage.removeItem("loggedIn");

  return (
    <div className="logout-text">
      <h3>
        Thx from the app usage,
        <br></br>have a nice day.
      </h3>
      {setTimeout(() => {
        window.open("/", "_self");  
      }, [4000])}
    </div>
  );
}
