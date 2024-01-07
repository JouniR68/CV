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
import Tech from "./components/Tech";
import AddItem from "./components/AddIItem";
import Looking from "./components/Looking";

import { BrowserRouter, Routes, Route } from "react-router-dom";

/*
            <Route path="work" element={<Work />}>
              <Route index element={<Looking />} />
              <Route path="Looking" element={<Looking />} />
              <Route path='Tech' element={<Tech />} />
            </Route>

*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="add" element={<AddItem />} />
          </Route>

          <Route path="cv" element={<CVLayout />}>
            <Route path="education" element={<Education />} />
            <Route path="work" element={<Work />} />
            <Route path='Tech' element={<Tech />} />          
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
