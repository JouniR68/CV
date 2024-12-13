import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/admin.css"

export default function AdminLayout() {
  const [access, setAccess] = useState(false)
  let accessValid = ""

  accessValid = useRef(sessionStorage.getItem("adminLevel"))

  useEffect(() => { accessValid ? setAccess(true) : setAccess(false) }, [

  ])


  return (
    <>
      {access ?
        <div className = "admin">
          <nav className="host-nav">            
            <Link to="tunterointi">Tuntien kirjaus</Link>
            <Link to="naytaPyynnot">Näytä työpyynnöt</Link>
            <Link to="poistatunnus">Poista tunnus</Link>
            <Link to="lasku">Tuntiraportti</Link>
            <Link to="tarjouslomake">Tarjouslomake</Link>
          </nav>
          <Outlet />
        </div>
        : <h1>Ei pääsyä admin toimintoihin</h1>
      }
    </>
  );
}
