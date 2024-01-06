import { Link, Outlet } from "react-router-dom";

export default function PersonalLayout() {
  return (
    <>
      <nav className="host-nav">
        <Link to="/personal/tasks">Personal tasks</Link>
      </nav>
      <Outlet />
    </>
  );
}
