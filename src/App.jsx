/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import "./App.css";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Why from "./components/Why";
import Intrests from "./components/Intrest"
import Looking from './components/Looking';
import Login from "./components/Login";
import Logout from "./components/Logout";
import CVLayout from "./Layouts/CVLayout";
import ProfileLayout from "./Layouts/ProfileLayout";
import Work from "./components/Work";
import Education from "./components/Education";
import Tech from "./components/Tech";
import CV from "./components/Output"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: 'red',
      secondary: '#bbbbbb',
    },
  },
});


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Ligth</Typography>
          <Switch checked={isDarkMode} onChange={toggleTheme} />
          <Typography>Dark</Typography>
        </Stack>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path="output" element={<CV />} />
              <Route path='profile' element={<ProfileLayout />}>
                <Route index element={<Profile />} />
                <Route path='intrests' element={<Intrests />} />
                <Route path='why' element={<Why />} />
                <Route path='looking' element={<Looking />} />
              </Route>

              <Route path='admin' element={<AdminLayout />}>
                <Route index element={<Login />} />
                <Route path='logout' element={<Logout />} />
              </Route>

              <Route path='cv' element={<CVLayout />}>
                <Route index element={<Work />} />
                <Route path='education' element={<Education />} />
                <Route path='work' element={<Work />} />
                <Route path='Tech' element={<Tech />} />
                <Route path='Contact' element={<Contact />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
