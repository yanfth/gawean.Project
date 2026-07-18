import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Assuming index.css exists
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardPenyedia from "./pages/DashboardPenyedia";
import DashboardPencari from "./pages/DashboardPencari";
import Komunitas from "./pages/Komunitas";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-penyedia" element={<DashboardPenyedia />} />
        <Route path="/dashboard-pencari" element={<DashboardPencari />} />
        <Route path="/komunitas" element={<Komunitas />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

