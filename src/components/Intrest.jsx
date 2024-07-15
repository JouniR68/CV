import { t } from "i18next";
import JsonData from "../../data/datapkg.json";
import { Outlet } from "react-router-dom";

export default function Intrest() {
  
  return (
    <div>
      <hr></hr>
      <div className="output--text">
        {t('Intrest')}
      </div>
      <div className="photo-grid">
        <img src="/Images/Scout.jpg" />
        <img src="/Images/Ktm.jpg" />
      </div>
      <Outlet />
    </div>
  );
}
