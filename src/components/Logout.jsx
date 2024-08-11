import { useContext } from "react";
import { AuthContext } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import { Description, SettingsOutlined } from "@mui/icons-material";

export default function Logout() {
  const { isLoggedIn, login, logout, setIsLoggedIn } = useContext(AuthContext);  
  const navigate = useNavigate()
  navigate('done', {state: {description: "You have been kicked off"}})

  setTimeout(() => {
    setIsLoggedIn(false)
    window.open("/", "_self");  
  }, [4000])
  
  


  /*return (
    <div className="logout-text">
      <h3>
        Thx from the app usage,
        <br></br>have a nice day.
      </h3>
      {setTimeout(() => {
        window.open("/", "_self");  
      }, [4000])}
    </div>
  );*/
}
