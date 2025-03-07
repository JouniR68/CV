import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../LoginContext";

function Done() {
  const { setIsLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()
  const location = useLocation()
  const [close, setClose] = useState(false)
  const navigate = useNavigate();

  const { state } = location;
  let { description } = state;
  let title = ""
  let disclaimerContent = false;

  if (description === "disclaimer") {
    disclaimerContent = true
    description = t('Disclaimer')
  }

  else if (description === "logout") {
    disclaimerContent = true
    description = t('LogoutText')
  }

  const ok = () => {
    setClose(true)
    setTimeout(() => {
      setIsLoggedIn(false)
      disclaimerContent === true ? navigate('/') : navigate("/userLogin");
    }, [2000])
  }

  if (description === 'disclaimer') {
    disclaimerContent ? title = t('DisclaimerTitle') : title = t('Confirmation')
  } else if (description === 'logout') {
    title = t('LogoutTitle')
    description = t('LogoutText')
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <h2>{title}</h2>
        {description}
        <button id="ok" onClick={ok}>{t('Ok')}</button>
      </div>

    </div>

  );
}

export default Done;
