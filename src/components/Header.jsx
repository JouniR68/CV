import { Link } from "react-router-dom";
import Login from "./Login"
export default function Header() {
  let isUserLoggedIn = sessionStorage.getItem("loggedIn")
  isUserLoggedIn === "true" ? isUserLoggedIn = true : isUserLoggedIn = false
  
  return (
    <header className="app-header">
      <Link className="site-logo" to="/">#JRLA</Link>
      {!isUserLoggedIn ? <nav> 
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>          
        <Link to="/cv">CV</Link>
        <Link to="/output">Printable CV</Link>
        <Link to="/rent">Rent Work</Link>
      </nav> : 
      <Login />}
    </header>
  );
}
