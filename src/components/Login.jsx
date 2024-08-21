import React, {useContext} from "react";
import axios from "axios";
import NotificaatioDialog from "./NotificaatioDialog";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./LoginContext";
import { useTranslation } from "react-i18next";
import "../index.css";

const servUrl = import.meta.env.VITE_SERVER

export default function Login() {
  const [userPwd, setUserPwd] = React.useState(null);
  const [close, setClose] = React.useState(true)
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, setIsLoggedIn } = useContext(AuthContext);
  const {t} = useTranslation()
  console.log("isLoggedIn: ", isLoggedIn)
  
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    //const url = 'https://firma-ed35a.web.app/fetchPlaces/access'
    const url2 = "https://softa-apu.fi/access"

    try {
      const params = { userPwd: userPwd }
      const response = await axios.get(url2, { params });
      console.log("login response: ", response.status + ', ' + response.data)
      if (response.status === 200) {
        setIsLoggedIn(true)
        sessionStorage.setItem("loggedIn", true);    
        navigate('/')   
      }
      else {
        navigate('error', { state: { locationError: 'Invalid password' } })
      }
    } catch (error) {
      
      console.log('Error sending request to Cloud function: ', error.message);
    }
  }
  const onCloseDialog = () => {
    setClose(!close)
  }

  return (
    <div className="main">
      <form className="login--form">
        <label>{t('password')}</label>
        <input type="password" name="pwd" onChange={(event) => setUserPwd(event.target.value)} />
        <button onClick={onSubmit}>{t('check')}</button>
      </form>
    </div>
  );
}