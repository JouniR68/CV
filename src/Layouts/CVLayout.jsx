import { Link, Outlet } from "react-router-dom";

export default function CVLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="work">Work</Link>
        <Link to="education">Education</Link>
        <Link to="tech">Tech</Link>        
      </nav>
      <Outlet />
    </>
  );
}
