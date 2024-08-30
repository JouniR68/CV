import { useContext } from "react";
import { AuthContext } from "./LoginContext";
import { useNavigate } from "react-router-dom";
import { Description, SettingsOutlined } from "@mui/icons-material";

export default function Logout() {
  const { isLoggedIn, login, logout, setIsLoggedIn } = useContext(AuthContext);  
  const navigate = useNavigate()
  navigate('/done', {state: {description: "You have been kicked off"}})
  setIsLoggedIn(false)
}
