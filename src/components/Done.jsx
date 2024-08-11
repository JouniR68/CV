import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";



function Done() {
  
  const {t} = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [close, setClose] = useState(false)
  const [text, setText] = useState(null)
  
  const {state} = location;
  const {description} = state;
  
  const ok = () => {
    setClose(true)
    navigate('/')
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
