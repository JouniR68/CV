import { Link, Outlet } from "react-router-dom";

export default function CVLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="work">Work History</Link>
        <Link to="education">Education</Link>  
        <Link to="Tech">Tech Stack</Link>  
      </nav>
      <Outlet />
    </>
  );
}
