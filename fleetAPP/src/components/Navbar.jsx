import React from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../controller/AuthController";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Verifica se o usuário está logado

  const handleLogoutClick = () => {
    handleLogout(navigate); // Chama a função de logout e redireciona
  };

  const handleLogoClick = () => {
    // Chama a função de logout ao clicar no logo FleetPlus
    handleLogout(navigate); // Redireciona para a página de login após logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-bg fixed-top navbar-brand">
      <div className="container-fluid">
        <a
          className="navbar-brand"
          href="#"
          onClick={handleLogoClick} // Chama a função de logout ao clicar no logo
        >
          FleetPlus
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                Sobre
              </Link>
            </li>
            <li className="nav-item">
              {token ? (
                // Exibe Logout se o token estiver presente (usuário está logado)
                <button
                  className="btn nav-link"
                  onClick={handleLogoutClick}
                  style={{
                    border: "none",
                    background: "none",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Sair
                </button>
              ) : (
                // Exibe Login se o token não estiver presente
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
