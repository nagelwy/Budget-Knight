import React from 'react';
import './App.css';
import { useState } from 'react';
// import { EmailProvider } from './EmailContext';

import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import EmailProvider from './components/EmailContext';

const App = () => {

  const [email, setEmail] = useState('');

  return (
  <EmailProvider>
      <BrowserRouter>
      <Routes>
        <Route path="" index element={<HomePage />} />
        <Route path="/login" index element={<LoginPage />} />
        <Route path="/register" index element={<RegisterPage />} />
        <Route path="/main" index element={<MainPage email={email}/>} />
      </Routes>
    </BrowserRouter>
  </EmailProvider>
);
}

export default App;
