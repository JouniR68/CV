import { Link } from "react-router-dom";
import Login from "./Login"
export default function Header() {
  let isUserLoggedIn = sessionStorage.getItem("loggedIn")
  isUserLoggedIn === "true" ? isUserLoggedIn = true : isUserLoggedIn = false
  // {isUserLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link> }        
  return (
    <header>
      <Link className="site-logo" to="/">#JRLA</Link>
      {isUserLoggedIn ? <nav> 
        <Link to="/">Home</Link>
        <Link to="/add">Add</Link>  
        <Link to="/work">Work</Link>
        <Link to="/personal">Personal</Link>
        {isUserLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link> } 
        

      </nav> : 
      <Login />}
    </header>
  );
}
