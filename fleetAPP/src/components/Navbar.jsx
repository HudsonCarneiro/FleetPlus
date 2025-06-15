import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogoutClick = () => logout(navigate);
  const handleLogoClick = () => logout(navigate);

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-bg fixed-top navbar-brand">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={handleLogoClick}>
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
              <Link className="nav-link" to="/about">Sobre</Link>
            </li>
            <li className="nav-item">
              {isAuthenticated ? (
                <button className="btn nav-link" onClick={handleLogoutClick}>
                  Sair
                </button>
              ) : (
                <Link className="nav-link" to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

