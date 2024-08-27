import React, {useContext} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./LoginContext";
import { useTranslation } from "react-i18next";
import "../index.css";

export default function Login() {
  const [userPwd, setUserPwd] = React.useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const {t} = useTranslation()
  console.log("isLoggedIn: ", isLoggedIn)
  
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const url = 'https://europe-west2-firma-ed35a.cloudfunctions.net/access'  

    try {
      const params = { userPwd: userPwd }
      const response = await axios.get(url, { params });
      console.log("login response: ", response.status + ', ' + response.data)
      if (response.status === 200) {
        setIsLoggedIn(true)        
        navigate('/c')   
      }
      else {
        navigate('/error', { state: { locationError: 'Invalid password' } })
      }
    } catch (error) {      
      console.log('Error sending request to Cloud function: ', error.message);
    }
  }
  /*const onCloseDialog = () => {
    setClose(!close)
  }*/

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