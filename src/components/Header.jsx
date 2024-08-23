import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom";
import Login from "./Login"
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AuthContext } from "./LoginContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Header() {
  const [unreadMessages, setUnreadMessages] = useState(false)
  const { t } = useTranslation();
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  console.log(isLoggedIn)
  
  useEffect(() => {
    const fetchMessages = async () => {
        const eventsCollection = await getDocs(collection(db, 'messages'));
        const docs = eventsCollection.map(doc => doc.id)
        if (!docs){
          console.log("No messages")
          return
        } else {
          setUnreadMessages(true)
        }
    };
    fetchMessages();
}, []);

  return (
    <header className="app-header">
      <nav>
        <Link to="/home">{t('Home')}</Link>
        <Link to="/profile">{t('Profile')}</Link>
        <Link to="/rent">{t('Services')}</Link>
        <Link to="/checkLocation"><IconButton><LocationOnIcon /></IconButton></Link>
        {unreadMessages && isLoggedIn === false && <Link style={{color:'red'}} to="/login">A</Link>}
        {!unreadMessages && isLoggedIn === false && <Link style={{color:'black'}} to="/login">A</Link>}
        {isLoggedIn &&
          <>
            <Link to="/c">V</Link>
            <Link to="/calendar">K</Link>
            <Link to="/logout">L</Link>
          </>}


      </nav>

    </header>
  );
}
