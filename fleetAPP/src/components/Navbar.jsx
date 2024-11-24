import React from "react";
import "../styles/Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-bg fixed-top navbar-brand">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">FleetPlus</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Sobre</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/AuthForm" style={{ marginRight: "30px" }}>Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
