// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage.tsx'
import CardPage from './pages/CardPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx';

export default function App() 
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<LoginPage />} />
        <Route path="/shuzzy" element={<CardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

