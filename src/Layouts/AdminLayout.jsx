import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="/add">Add data</Link>        
      </nav>
      <Outlet />
    </>
  );
}
