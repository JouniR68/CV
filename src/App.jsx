/* eslint-disable react/jsx-no-comment-textnodes */
import "./App.css";
import Layout from "./Layouts/Layout";
import WorkLayout from "./Layouts/WorkLayout";
import PersonalLayout from "./Layouts/PersonalLayout";
import Home from "./components/Home";
import Project from "./components/Work/Project";
import Development from "./components/Work/Development";
import WorkTasks from "./components/Work/Tasks";
import WorkIssues from "./components/Work/Issues";
import AddItem from "./components/AddIItem";
import Login from "./components/Login";
import Logout from "./components/Logout";
import PersonalTasks from "./components/Personal/Tasks";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route path = "/work" element={<WorkLayout />}>
            <Route path="/work/mgmt" element={<Project />} />
            <Route path="/work/develop" element={<Development />} />
            <Route path="/work/issues" element={<WorkIssues />} />
            <Route path="/work/tasks" element={<WorkTasks />} />
          </Route>

          <Route path = "/personal" element={<PersonalLayout />}>
            <Route path="/personal/tasks" element={<PersonalTasks />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
