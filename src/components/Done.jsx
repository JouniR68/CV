import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./LoginContext";

function Done() {
  const {setIsLoggedIn} = useContext(AuthContext)
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [close, setClose] = useState(false)
  
  const {state} = location;
  const {description} = state;
  
  const ok = () => {
    setClose(true)
    setTimeout(() => {
      setIsLoggedIn(false)
      window.open("/", "_self");  
    }, [2000])
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">        
        <h2>{t('Confirmation')}</h2> 
        <h4>{description}</h4>
        <button id="ok" onClick={ok}>{t('Ok')}</button>                
      </div>
    </div>
  );
}

export default Done;
