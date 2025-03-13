/* eslint-disable react/jsx-no-comment-textnodes */
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Header from "./components/header"
import Heavy from "./components/Dialogs/Heavy";
import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ShopLayout from "./Layouts/ShopLayout";
import HuoltoLayout from "./Layouts/HuoltoLayout";
import Home from "./components/Home";
import Profile from "./components/CV/Profile";
import Rent from "./components/Services";
import Customer from "./components/services/tarjous/AddCustomer";
import CustomerData from "./components/services/tarjous/NaytaPyynnot";
import Messages from "./components/Messages"
import ShowMessages from "./components/ShowMessages";
import Intrests from "./components/Intrest"
import Looking from './components/CV/Looking';
import AdminLogin from "./components/User/AdminLogin";
import Logout from "./components/User/Logout";
import CVLayout from "./Layouts/CVLayout";
import ProfileLayout from "./Layouts/ProfileLayout";
import Work from "./components/CV/Work";
import Education from "./components/CV/Education";
import Tech from "./components/CV/Tech";
import CV from "./components/CV/Output"
import Contact from "./components/Contact";
import CollectionCounts from "./components/services/dashboard/News"
import ThankYouPage from "./components/Dialogs/ThankYou";
import ContractForm from "./components/services/tarjous/AddContract";
import '../i18n'; // Import the i18n configuration
import ErrorMessage from "./components/Dialogs/ErrorMessage";
import Address from "./components/Address";
import CheckLocation from "./components/CheckLocation";
import { AuthProvider } from "./components/LoginContext";
import Done from "./components/Dialogs/Done";
import ErrorNote from "./components/Dialogs/ErrorNote";
import Calendar from "./components/services/dashboard/Calendar";
import TarjousLomake from "./components/services/tarjous/Tarjouslomake";
import Register from "./components/User/Register";
import Contacts from "./components/Contact";
import { UserLogin } from "./components/User/UserLogin"
import Tunterointi from "./components/services/tarjous/Tunterointi"
import Report from "./components/services/tarjous/Report"
import TarjouspyyntoForm from "./components/services/tarjous/PyydaTarjous";
import NotFound from "./components/Dialogs/NotFound";
import KohteenKuvat from "./components/KohteenKuvat"
import Poistatunnus from "./components/User/Poistatunnus"
import InactivityTimer from "./components/InActivity";
import Learnings from "./components/CV/Learnings"
import Budjetti from "./components/Talous/Budjetti"
import CoverLetter from "./components/CV/Letter";
import Letter from "./components/CV/WebLetter";
import CVPdf from "./components/CV/CVPdf"
import Vehicles from "./components/Huolto/Vehicles";
import Feedback from "./components/Feedback";
import ShowFeedback from "./components/ShowFeedback";
import MindMap from "./components/CV/MindMap";

import Sali from "./components/sali/Sali";
import StockFetcher from "./components/Talous/Finance";

import Suberb from "./components/Huolto/suberb/UploadSuberb";
import ReadSuberb from "./components/Huolto/suberb/ReadSuberb";
import CreateSuberb from "./components/Huolto/suberb/CreateSuberbRow";

import WRellu from "./components/Huolto/WRellu/UploadWRellu";
import ReadWRellu from "./components/Huolto/WRellu/ReadWRellu";
import CreateWRellu from "./components/Huolto/WRellu/CreateWRelluRow";

import Catalog from "./components/services/shop/AddShopItem"
import Basket from "./components/services/shop/TheBasket";
import Orders from "./components/services/shop/ShowOrders";

import Lista from "./components/Reissu/Lista";

/*
function HideHeader() {
  const location = useLocation();
  const currentPath = location.pathname;
  // Hide Header in NotHeader route
  return !currentPath.includes('reissulista') ? <Header /> : null;
}
  {window.location.pathname !== "/reissulista" ? <Header />: null}
  */

function App() {
  //<Route path='hider' element={<HideHeader />} />
  return (
    <div className="app-container">
      <AuthProvider>
      
        <BrowserRouter>
        
          <Routes>          
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path="/mm" element={<MindMap />} />
              <Route path="/huoltorekisteri" element={<Vehicles />} />
              <Route path="/sali" element={<Sali />} />
              <Route path="/news" elements={<CollectionCounts />} />
              <Route path='/inActivity' element={<InactivityTimer />} />
              <Route path='/budjetti' element={<Budjetti />} />
              <Route path='/letter' element={<CoverLetter />} />
              <Route path='/webletter' element={<Letter />} />
              <Route path='/opit' element={<Learnings />} />
              <Route path='/home' element={<Home />} />
              <Route path='/checkLocation' element={<CheckLocation />} />
              <Route path="address" element={<Address />} />
              <Route path="error" element={<ErrorMessage />} />
              <Route path='tarjousPyynto' element={<TarjouspyyntoForm />} />
              <Route path='logout' element={<Logout />} />
              <Route path="userLogin" element={<UserLogin />} />
              <Route path="adminLogin" element={<AdminLogin />} />
              <Route path="register" element={<Register />} />
              <Route path="done" element={<Done />} />
              <Route path="errorNote" element={<ErrorNote />} />
              <Route path='lasku' element={<Report />} />
              <Route path='messages' element={<Messages />} />
              <Route path='showMessages' element={<ShowMessages />} />
              <Route path='palaute' element={<Feedback />} />
              <Route path='naytapalaute' element={<ShowFeedback />} />
              <Route path='stock' element={<StockFetcher />} />
              <Route path='heavyCheck' element={<Heavy />} />
              <Route path='reissulista' element={<Lista />} />


              <Route path='huollot' element={<HuoltoLayout />} >
                <Route path='uploadsuberb' element={<Suberb />} />
                <Route path='showsuberb' element={<ReadSuberb />} />
                <Route path='createsuberb' element={<CreateSuberb />} />

                <Route path='uploadwRellu' element={<WRellu />} />
                <Route path='showWRellu' element={<ReadWRellu />} />
                <Route path='createWRellu' element={<CreateWRellu />} />

              </Route>

              <Route path='profile' element={<ProfileLayout />}>
                <Route index element={<Profile />} />
                <Route path="cv" element={<CVPdf />} />
                <Route path="output" element={<CV />} />
                <Route path='intrests' element={<Intrests />} />
                <Route path='looking' element={<Looking />} />
                <Route path="kohde" element={<KohteenKuvat />} />
              </Route>


              <Route path='admin' element={<AdminLayout />}>
                <Route path="tunterointi" element={<Tunterointi />} />
                <Route path="poistatunnus" index element={<Poistatunnus />} />
                <Route path='naytaPyynnot' element={<CustomerData />} />
                <Route path="lasku" element={<Report />} />
                <Route path="tarjouslomake" element={<TarjousLomake />} />
              </Route>

              <Route path='rent' index element={<Rent />} />
              <Route path='addCustomerData' element={<Customer />} />
              <Route path='dashboard' element={<Calendar />} />
              <Route path='thanks' element={<ThankYouPage />} />
              <Route path='contract' element={<ContractForm />} />

              <Route element={<ShopLayout />}>
                <Route path='shop' index element={<Catalog />} />
                <Route path='basket' element={<Basket />} />
                <Route path='customers' element={<Contacts />} />
                <Route path='orders' element={<Orders />} />
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
