import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "./auth";
import { useAuth } from "./LoginContext";
import { useTranslation } from "react-i18next";



export default function Logout() {
  const {setIsLoggedIn} = useAuth();
  const {t} = useTranslation()
  const navigate = useNavigate()
  useEffect(() => {navigate('/done', { state: { description: t('LogoutText') }})},[])
  setIsLoggedIn(false)
  sessionStorage.removeItem("adminLevel")
  sessionStorage.removeItem("firstName")
  sessionStorage.removeItem("lastName")
  sessionStorage.removeItem("email")
  sessionStorage.removeItem("address")
  sessionStorage.removeItem("phoneNumber")
  sessionStorage.removeItem("loggedIn")
  doSignOut()
  
  
}
