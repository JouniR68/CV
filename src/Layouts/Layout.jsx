import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sos from "../components/Sos"

export default function Layout() {
    return (
      <>
        <Header />
        <Sos />
        <Outlet />
      </>
    );
}