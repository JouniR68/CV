import { Link } from "react-router-dom";
import Login from "./Login"
export default function Header() {
  let isUserLoggedIn = sessionStorage.getItem("loggedIn")
  isUserLoggedIn === "true" ? isUserLoggedIn = true : isUserLoggedIn = false
  
  return (
    <header className="app-header">
      <Link to="/">#JRLA</Link>
      {!isUserLoggedIn ? <nav> 
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>                  
        <Link to="/output">CV</Link>
        <Link to="/rent">Services</Link>
      </nav> : 
      <Login />}
    </header>
  );
}
