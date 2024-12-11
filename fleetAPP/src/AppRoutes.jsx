import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import UserForm from './components/UserForm';
import { About } from './components/About';
import AuthForm from './components/AuthForm'; // Componente de login
import Dashboard from './components/Dashboard'; // Dashboard do usuário
import PrivateRoute from './routes/PrivateRoute.jsx'; // Rota protegida (se necessário)
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";



const AppRoutes = () => {
  return (
    <Router>
      <div className="background">
        <ToastContainer />
        <Navbar />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<UserForm />} />

          {/* Rota protegida */}
          <Route
            path="/dashboard"
            element={
           
                <Dashboard />
            
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;

