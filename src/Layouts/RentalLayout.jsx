import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  /*
        <Link to="customers">Customers</Link>        
        <Link to="contracts">Contracts</Link>
        <Link to="thanks">Thank You</Link>
  */
  return (
    <>
      <nav className="host-nav">
        <Link to="addCustomerData">Customers</Link>
      </nav>
      <Outlet />
    </>
  );
}
