import React from "react";
import "../styles/HeroSection.css";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const HeroSection = () => {
  return (
    <div className="background">
      <div className="container text-center hero-section">
      <div className="title">
        <h1 className="display-4">Bem-vindo ao APP WEB!</h1>
        <p className="lead">Experimente esse modelo de pagina de cadastro web utilizando Nodejs e React</p>
        <br />
        <Link to="/register">
          <button type="button" className="btn btn-primary btn-lg mt-4">Cadastre-se Agora</button>
        </Link>
      </div>
    </div>
  </div>
  );
};

