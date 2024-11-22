import React from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="background">
      <Navbar />
      <HeroSection />
    </div>
  );
}

export default App;
