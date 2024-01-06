/* eslint-disable react/jsx-no-comment-textnodes */
import "./App.css";
import Layout from "./Layouts/Layout";
import WorkLayout from "./Layouts/WorkLayout";
//import PersonalLayout from "./Layouts/PersonalLayout";
import Home from "./components/Home";
import Project from "./components/Education";
import WorkIssues from "./components/Work";
//import AddItem from "./components/AddIItem";
import Login from "./components/Login";
import Logout from "./components/Logout";
//import PersonalTasks from "./components/Personal/Tasks";

import { BrowserRouter, Routes, Route } from "react-router-dom";


/*
        <Route path="/add" element={<AddItem />} />
  
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route path = "/work" element={<WorkLayout />}>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
