import { Link, Outlet } from "react-router-dom";

export default function ShopLayout() {
  //<Link to="catalog">Catalog</Link>        
  return (
    <>
      <nav className="host-nav">
        
      </nav>
      <Outlet />
    </>
  );
}
