import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./LoginContext";
import { useTranslation } from "react-i18next";
import "../index.css";
import { doSignInWithGoogle, doSignOut } from "./auth";
import { useAuth } from "./LoginContext";


export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, setCurrentUser, currentUser, setIsLoggedIn } = useAuth();
  console.log("Is user logged in ?", isLoggedIn)

  const googleLogin = async () => {
    try {
      console.log("Google login")
      const user = await doSignInWithGoogle()
      if (!user) {
        console.error("Signing failed")        
        setIsLoggedIn(false)
        doSignOut()
        navigate('/home')
      } else {
        setCurrentUser(user)
        setIsLoggedIn(true)
        sessionStorage.setItem("adminLevel", "valid")
        console.log("sessio recorded")
      }
    } catch (err) {
      console.error("google signing failed: ", err)
      setIsLoggedIn(false)
      doSignOut();
      return null;
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      googleLogin()
    }
  }, [])

  return (
    <div>
      {isLoggedIn && setTimeout(() => {
        <h1>`${currentUser} on kirjautunut`</h1>
      }, [2000])
      }
      {navigate('/home')}
    </div>
  )


}
