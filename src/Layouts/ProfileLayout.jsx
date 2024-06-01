import { Link, Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <>
      <nav className='host-nav'>
        <Link to='intrests'>Intrests</Link>
        <Link to='why'>Why to hire?</Link>
        <Link to='looking'>Open for new challenges</Link>
      </nav>
      <Outlet />
    </>
  );
}
