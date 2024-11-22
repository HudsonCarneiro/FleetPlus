import React from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { UserForm } from './components/UserForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="background">
      <Navbar />
      <HeroSection />
      <UserForm />
    </div>
  );
}

export default App;
