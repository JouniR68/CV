/* eslint-disable react/jsx-no-comment-textnodes */
import "./index.css";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import RentalLayout from "./Layouts/RentalLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Rent from "./components/Services";
import Customer from "./components/AddCustomer";
import CustomerData from "./components/ShowData";
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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Contact from "./components/Contact";
import ThankYouPage from "./components/ThankYou";
import ContractForm from "./components/AddContract";
import '../i18n'; // Import the i18n configuration
import ErrorMessage from "./components/ErrorMessage";
import Address from "./components/Address";
import CheckLocation from "./components/CheckLocation";
import TestLocation from "./components/TestPlaces"
import TestArray from "./components/TestArray";
import { AuthProvider } from "./components/LoginContext";
import Done from "./components/Done";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/t' element={<TestArray />} />
              <Route path='/tl' element={<TestLocation />} />
              <Route path='/checkLocation' element={<CheckLocation />} />
              <Route path="output" element={<CV />} />
              <Route path="address" element={<Address />} />
              <Route path="error" element={<ErrorMessage />} />
              <Route path="login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="done" element={<Done />} />
              <Route path="c" element={<CustomerData />} />
              <Route path='profile' element={<ProfileLayout />}>
                <Route index element={<Profile />} />
                <Route path='cv' element={<CVLayout />}>
                  <Route index element={<Work />} />
                  <Route path='education' element={<Education />} />
                  <Route path='work' element={<Work />} />
                  <Route path='Tech' element={<Tech />} />
                  <Route path='Contact' element={<Contact />} />
                </Route>
                <Route path='intrests' element={<Intrests />} />
                <Route path='why' element={<Why />} />
                <Route path='looking' element={<Looking />} />
              </Route>

              <Route path='admin' element={<Login />}>
                <Route index element={<Login />} />
                <Route path='logout' element={<Logout />} />
              </Route>

              <Route path='c' element={<CustomerData />} />

              <Route element={<RentalLayout />}>
                <Route path='rent' index element={<Rent />} />
                <Route path='addCustomerData' element={<Customer />} />                
                <Route path='calendar' element={<Calendar />} />
                <Route path='thanks' element={<ThankYouPage />} />
                <Route path='contract' element={<ContractForm />} />
              </Route>

            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </div>
  );
}

export default App;
