import React from "react";
import axios from "axios";
import NotificaatioDialog from "./NotificaatioDialog";
const servUrl = import.meta.env.VITE_SERVER

export default function Login() {
  const [userPwd, setUserPwd] = React.useState(null);
  const [close, setClose] = React.useState(true)
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("target server:", servUrl)
      const response = await axios.post(`${servUrl}/api/login`, { userPwd },{
        headers: {
          'Content-Type': 'application/json',
        },
      } );
      
      if (response.status === 200) {
        sessionStorage.setItem("loggedIn", true);
        <NotificaatioDialog message = "Hey, olette kirjautunut" onClose = {onCloseDialog} />        
        window.open(`/`, "_self")  
      } else if (response.status === 204) {
        window.alert("Kirjautumis yritys hylätty !");
      }
    } catch (err) {
      console.log("Meni aivan vituiksi, error: ", err);
    }
  };

  const onCloseDialog = () => {
    setClose(!close) 
  }

  return (
    <div className="main">
      {close && <form className="login--form">
        <label>Password</label>
        <input type="password" name="pwd" onChange={(event) => setUserPwd(event.target.value)} />
        <button onClick={onSubmit}>Tarkista</button>        
      </form>}
    </div>
  );
}