import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import UserForm from './components/UserForm';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  
  return (
    <Router>
      <div className="background">
        <Navbar />
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<HeroSection />} />
          {/* Rota para o formulário */}
          <Route path="/register" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
