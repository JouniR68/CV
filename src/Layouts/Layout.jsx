import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;

    return (
      <>
        <Header/>                
        <Outlet />
        {currentPath != '/tarjouspyynto' && <Footer/>}
      </>
    );
}