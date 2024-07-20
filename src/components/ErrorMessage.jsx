import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";



function ErrorMessage() {
  
  const {t} = useTranslation()
  const navigate = useNavigate()
  
  const ok = () => {
    navigate('/', {state: {locationError: t('retrieving_position_failed')}})
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">        
        <h2>{t('Error')}</h2> 
        <h4>{t('retrieving_position_failed')}</h4>
        <button id="ok" onClick={ok}>{t('Ok')}</button>                
      </div>
    </div>
  );
}

export default ErrorMessage;
