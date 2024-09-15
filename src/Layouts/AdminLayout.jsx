import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="tunterointi">Tuntien kirjaus</Link>
        <Link to="naytaPyynnot">Näytä työpyynnöt</Link>        
        <Link to="tarjous">Tarjouslomake</Link>
        <Link to="poistatunnus">Poista tunnus</Link>                        
        <Link to="lasku">Tuntiraportti</Link>              
      </nav>
      <Outlet />
    </>
  );
}
