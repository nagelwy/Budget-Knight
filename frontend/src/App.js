import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="" index element={<HomePage />} />
      <Route path="/login" index element={<LoginPage />} />
      <Route path="/register" index element={<RegisterPage />} />
      <Route path="/main" index element={<MainPage />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;