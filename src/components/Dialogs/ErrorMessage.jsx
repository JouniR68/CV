import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../LoginContext";



function ErrorMessage() {
  
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [close, setClose] = useState(false)
  const [text, setText] = useState(null)
  const {setIsLoggedIn} = useAuth()
  const {state} = location;
  const {locationError} = state;
  
  const ok = () => {
    setClose(true)
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">        
        <h2>{t('Error')}</h2> 
        <h4>{locationError}</h4>
        <button id="ok" onClick={ok}>{t('Ok')}</button>                      
      </div>
    </div>
  );
}

export default ErrorMessage;
