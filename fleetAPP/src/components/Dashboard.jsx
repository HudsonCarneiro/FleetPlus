// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import UserProfile from "./UserProfile";
import UserModal from "./UserModal";
import DriverTable from "./DriverTable";
import ClientTable from "./ClientTable";
import FuelingTable from "./FuelingTable";
import DeliveryTable from "./DeliveryTable";
import { Sidebar } from "./Sidebar";
import { fetchDashboardData } from "../controller/DashboardController.js";

const SECTIONS = {
  VIEW_PROFILE: "verPerfil",
  VIEW_DELIVERIES: "verEntregas",
  CREATE_ORDER: "criarOrdem",
  VIEW_FUELING: "verAbastecimentos",
  REGISTER_FUELING: "registrarAbastecimento",
  VIEW_DRIVERS: "verMotoristas",
  ADD_DRIVER: "cadastrarMotorista",
  VIEW_CLIENTS: "verClientes",
  ADD_CLIENT: "cadastrarCliente",
};

const Content = ({ activeSection, userData, setActiveSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.VIEW_PROFILE:
        return <UserProfile userData={userData} />;
      case SECTIONS.VIEW_DELIVERIES:
        return <DeliveryTable />;
      case SECTIONS.CREATE_ORDER:
        return <h2>Criando uma nova ordem...</h2>;
      case SECTIONS.VIEW_FUELING:
        return <FuelingTable />;
      case SECTIONS.REGISTER_FUELING:
        return <h2>Registrando um novo abastecimento...</h2>;
      case SECTIONS.VIEW_DRIVERS:
        return <DriverTable />;
      case SECTIONS.ADD_DRIVER:
        return <h2>Cadastrando um motorista...</h2>;
      case SECTIONS.VIEW_CLIENTS:
        return <ClientTable />;
      case SECTIONS.ADD_CLIENT:
        return <h2>Cadastrando um cliente...</h2>;
      default:
        return (
          <p>
            Bem-vindo ao Painel de Controle, {userData?.name || "usuário"}! <br />
            Selecione uma opção no menu para ver os detalhes.
          </p>
        );
    }
  };

  return <div className="content">{renderContent()}</div>;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data when the component mounts
    fetchDashboardData(setUserData, setLoading, navigate);
  }, [navigate]);

  useEffect(() => {
    // Open modal when EDIT_PROFILE is the active section
    setIsModalOpen(activeSection === SECTIONS.EDIT_PROFILE);
  }, [activeSection]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveSection(""); // Reset active section when modal closes
  };

  const handleUserUpdate = (updatedUserData) => {
    setUserData(updatedUserData); // Update user data after editing
    handleModalClose(); // Close the modal after saving changes
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!userData) {
    return <p>Erro ao carregar os dados do usuário.</p>;
  }

  return (
    <section className="main">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Content activeSection={activeSection} userData={userData} setActiveSection={setActiveSection} />
    </section>
  );
};

export default Dashboard;
