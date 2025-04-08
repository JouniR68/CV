import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../LoginContext";

function Note() {
  console.log("Note");
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate();



  const { state } = location;
  let { title, description } = state;

  const ok = () => {
    navigate(-1);
  }


  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <h2>{title}</h2>
        <br></br>
        {description}
        <button id="ok" onClick={ok}>{t('Ok')}</button>
      </div>

    </div>

  );
}

export default Note;