/* eslint-disable react/jsx-no-comment-textnodes */
import "./index.css";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ShopLayout from "./Layouts/ShopLayout";
import RentalLayout from "./Layouts/RentalLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Rent from "./components/Services";
import Customer from "./components/AddCustomer";
import CustomerData from "./components/services/NaytaPyynnot";
import Why from "./components/Why";
import Intrests from "./components/Intrest"
import Looking from './components/Looking';
import Admin from "./components/AdminLogin";
import Logout from "./components/Logout";
import CVLayout from "./Layouts/CVLayout";
import ProfileLayout from "./Layouts/ProfileLayout";
import Work from "./components/Work";
import Education from "./components/Education";
import Tech from "./components/Tech";
import CV from "./components/Output"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import ThankYouPage from "./components/ThankYou";
import ContractForm from "./components/AddContract";
import '../i18n'; // Import the i18n configuration
import ErrorMessage from "./components/ErrorMessage";
import Address from "./components/Address";
import CheckLocation from "./components/CheckLocation";
import { AuthProvider } from "./components/LoginContext";
import Done from "./components/Done";
import Calendar from "./components/Calendar";
import Catalog from "./components/services/AddShopItem"
import Basket from "./components/services/TheBasket";
import TarjousLomake from "./components/services/Tarjous";
import Register from "./components/Register";
import Contacts from "./components/services/Contact";
import {UserLogin} from "./components/UserLogin"
import Tunterointi from "./components/services/Tunterointi"
import Report from "./components/services/Report"
import TarjouspyyntoForm from "./components/services/PyydaTarjous";
import NotFound from "./components/NotFound";
import KohteenKuvat from "./components/KohteenKuvat"
import Poistatunnus from "./components/Poistatunnus"

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/checkLocation' element={<CheckLocation />} />
              <Route path="output" element={<CV />} />
              <Route path="address" element={<Address />} />
              <Route path="error" element={<ErrorMessage />} />
              <Route path="tarjous" element={<TarjousLomake />} />              
              <Route path='tarjousPyynto' element={<TarjouspyyntoForm />} />
              <Route path='logout' element={<Logout />} />
              <Route path="userLogin" element={<UserLogin />} />
              <Route path="register" element={<Register />} />
              <Route path="done" element={<Done />} />
              <Route path='lasku' element={<Report />} />
              <Route path="admin" index element={<Admin />} />
              
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
                <Route path="kohde" element={<KohteenKuvat />} />
              </Route>

              <Route path='adminLayout' element={<AdminLayout />}>
                
                <Route path="tunterointi" index element={<Tunterointi />} />
                <Route path="poistatunnus" index element={<Poistatunnus />} />
                <Route path='naytaPyynnot' element={<CustomerData />} />                
                <Route path="lasku" element={<Report />} />                                                
              </Route>              

              <Route element={<RentalLayout />}>
                <Route path='rent' index element={<Rent />} />
                <Route path='addCustomerData' element={<Customer />} />                
                <Route path='calendar' element={<Calendar />} />
                <Route path='thanks' element={<ThankYouPage />} />
                <Route path='contract' element={<ContractForm />} />                
                
              </Route>

              <Route element={<ShopLayout />}>
                <Route path='catalog' index element={<Catalog />} />
                <Route path='basket' element={<Basket />} />
                <Route path='customers' element={<Contacts />} />
              </Route>              
              <Route path="*" element={<NotFound />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </div>
  );
}

export default App;
