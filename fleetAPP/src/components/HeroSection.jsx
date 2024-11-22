import React from "react";
import "../styles/HeroSection.css";

export const HeroSection = () => {
  return (
    <div className="container text-center hero-section">
      <div className="title">
        <h1 className="display-4">Bem-vindo à Fleet Plus!</h1>
        <p className="lead">Cadastre-se para gerenciar de forma eficaz e eficiente sua frota de veículos.</p>
        <a href="/formUser" className="btn btn-primary btn-lg mt-4">Cadastre-se Agora</a>
      </div>
    </div>
  );
};
