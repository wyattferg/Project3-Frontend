import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import MenuPage from "./components/MenuPage";
import CustomerPage from "./components/CustomerPage";
import LoginPage from "./components/LoginPage";
import ManagerPage from "./components/ManagerPage";
import CashierPage from "./components/CashierPage";
import BottomBar from "./components/BottomBar";
import { ZoomProvider } from './components/ZoomContext';

/**
 * Root component of the application.
 * 
 * @returns {JSX.Element} The JSX element representing the application structure.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<LandingPage />} />
          <Route path="MenuPage" element={<MenuPage />} />
          <Route path="CustomerPage" element={<CustomerPage />} />
          <Route path="LoginPage" element={<LoginPage />} />
          <Route path="ManagerPage" element={<ManagerPage />} />
          <Route path="CashierPage" element={<CashierPage />} />
        </Route>
      </Routes>
      <BottomBar />
    </BrowserRouter>
  );
}

// Create a root element for rendering the application.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application wrapped in StrictMode and ZoomProvider.
root.render(
  <React.StrictMode>
    <ZoomProvider>
      <App />
    </ZoomProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
