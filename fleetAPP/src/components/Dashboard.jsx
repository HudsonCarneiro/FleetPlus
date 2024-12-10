import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import ClientModal from "./ClientModal.jsx";
import UserProfile from "./UserProfile";
import VehicleTable from "./VehicleTable.jsx";
import VehicleModal from "./VehicleModal.jsx";
import DriverTable from "./DriverTable";
import DriverModal from "./DriverModal";
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
  VIEW_VEHICLE: "verVeiculos",
  ADD_VEHICLE: "cadastrarVeiculo",
  VIEW_CLIENTS: "verClientes",
  ADD_CLIENT: "cadastrarCliente",
};

const Content = ({
  activeSection,
  userData,
  onRequestAddClient,
  onRequestAddDriver,
  onRequestAddVehicle,
}) => {
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
        // Não chama diretamente a função, apenas renderiza a mensagem
        return <p>Preparando o modal para cadastrar motorista...</p>;
      case SECTIONS.VIEW_VEHICLE:
        return <VehicleTable />;
      case SECTIONS.ADD_VEHICLE:
        // Não chama diretamente a função, apenas renderiza a mensagem
        return <p>Preparando o modal para cadastrar veículo...</p>;
      case SECTIONS.VIEW_CLIENTS:
        return <ClientTable />;
      case SECTIONS.ADD_CLIENT:
        // Não chama diretamente a função, apenas renderiza a mensagem
        return <p>Preparando o modal para cadastrar cliente...</p>;
      default:
        return (
          <p>
            Bem-vindo ao Painel de Controle, {userData?.name || "usuário"}! <br />
            Use o menu lateral para navegar entre as seções.
          </p>
        );
    }
  };

  return <div className="content">{renderContent()}</div>;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await fetchDashboardData(setUserData, setLoading, navigate);
      } catch (err) {
        console.error("Erro ao carregar o dashboard:", err);
        setError("Erro ao carregar os dados do usuário. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  // Abre os modais com base na seção ativa
  useEffect(() => {
    if (activeSection === SECTIONS.ADD_CLIENT) {
      setIsClientModalOpen(true);
    } else if (activeSection === SECTIONS.ADD_DRIVER) {
      setIsDriverModalOpen(true);
    } else if (activeSection === SECTIONS.ADD_VEHICLE) {
      setIsVehicleModalOpen(true);
    }
  }, [activeSection]);

  const closeClientModal = () => {
    setIsClientModalOpen(false);
    setActiveSection(SECTIONS.VIEW_CLIENTS);
  };

  const closeDriverModal = () => {
    setIsDriverModalOpen(false);
    setActiveSection(SECTIONS.VIEW_DRIVERS);
  };

  const closeVehicleModal = () => {
    setIsVehicleModalOpen(false);
    setActiveSection(SECTIONS.VIEW_VEHICLE);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  }

  if (!userData) {
    return <p>Erro ao carregar os dados do usuário.</p>;
  }

  return (
    <section className="main">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Content
        activeSection={activeSection}
        userData={userData}
        onRequestAddClient={() => setActiveSection(SECTIONS.ADD_CLIENT)}
        onRequestAddDriver={() => setActiveSection(SECTIONS.ADD_DRIVER)}
        onRequestAddVehicle={() => setActiveSection(SECTIONS.ADD_VEHICLE)}
      />
      {isClientModalOpen && (
        <ClientModal
          show={isClientModalOpen}
          onClose={closeClientModal}
          clientData={selectedClient}
        />
      )}
      {isDriverModalOpen && (
        <DriverModal
          show={isDriverModalOpen}
          onClose={closeDriverModal}
          driverData={selectedDriver}
        />
      )}
      {isVehicleModalOpen && (
        <VehicleModal
          show={isVehicleModalOpen}
          onClose={closeVehicleModal}
          vehicleData={selectedVehicle}
        />
      )}
    </section>
  );
};

export default Dashboard;
