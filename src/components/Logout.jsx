import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "./auth";
import { useAuth } from "./LoginContext";

export default function Logout() {
  const {setIsLoggedIn} = useAuth();
  const navigate = useNavigate()
  useEffect(() => {navigate('/done', { state: { description: "You have been kicked off" } })},[])
  setIsLoggedIn(false)
  sessionStorage.removeItem("adminlevel")
  sessionStorage.removeItem("firstName")
  sessionStorage.removeItem("lastName")
  sessionStorage.removeItem("email")
  sessionStorage.removeItem("address")
  sessionStorage.removeItem("phoneNumber")
  sessionStorage.removeItem("loggedIn")
  doSignOut()
  
  
}
