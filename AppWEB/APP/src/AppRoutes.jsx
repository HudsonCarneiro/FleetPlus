import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import UserForm from './components/UserForm';
import UserFormEdit from './components/UserFormEdit';
import AuthForm from './components/AuthForm'; 
import Dashboard from './components/Dashboard'; 
import PrivateRoute from './routes/PrivateRoute'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AppRoutes = () => {
  return (
    <Router>
      <div className="background">
        <Navbar />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<UserForm />} />
          <Route path="/update" element={<UserFormEdit />} />

          {/* Rota protegida */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;

