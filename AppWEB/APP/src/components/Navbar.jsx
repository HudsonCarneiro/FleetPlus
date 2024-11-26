import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate(); // Hook do React Router para navegação

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-bg fixed-top navbar-brand">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">APPWEB</a>
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
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">Sobre</a>
            </li>
            <li className="nav-item">
              {/* Redirecionamento com onClick */}
              <button
                className="nav-link btn btn-link"
                style={{ textDecoration: "none", marginRight: "30px", color: "inherit" }}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
