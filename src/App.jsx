/* eslint-disable react/jsx-no-comment-textnodes */
import "./App.css";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Logout from "./components/Logout";
import CVLayout from "./Layouts/CVLayout";
import Work from "./components/Work";
import Education from "./components/Education";
import AddItem from "./components/AddIItem";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path = 'admin' element={<AdminLayout />}>
            <Route index element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="add" element={<AddItem />} />
          </Route>

          <Route path = 'cv' element={<CVLayout />}>
            <Route path="education" element={<Education />} />
            <Route path="work" element={<Work />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
