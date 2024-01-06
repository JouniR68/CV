import { Link, Outlet } from "react-router-dom";

export default function WorkLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="/work/mgmt">Project Mgmt</Link>
        <Link to="/work/develop">Development</Link>
        <Link to="/work/issues">Issues</Link>
        <Link to="/work/tasks">Tasks</Link>
      </nav>
      <Outlet />
    </>
  );
}
