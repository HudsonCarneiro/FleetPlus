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
  setActiveSection,
  openClientModal,
  openDriverModal,
  openVehicleModal,
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
        openDriverModal();
        return null;
      case SECTIONS.VIEW_VEHICLE:
        return <VehicleTable />;
      case SECTIONS.ADD_VEHICLE:
        openVehicleModal();
        return null;
      case SECTIONS.VIEW_CLIENTS:
        return <ClientTable />;
      case SECTIONS.ADD_CLIENT:
        openClientModal();
        return null;
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
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData(setUserData, setLoading, navigate);
  }, [navigate]);

  // Funções relacionadas ao ClientModal
  const openClientModal = (client = null) => {
    setSelectedClient(client); // Corrigido para selecionar o cliente
    setIsClientModalOpen(true);
  };

  const closeClientModal = () => {
    setIsClientModalOpen(false);
    setActiveSection("");
  };

  const refreshClients = () => {
    console.log("Atualizar lista de clientes após alteração.");
  };

  // Funções relacionadas ao DriverModal
  const openDriverModal = (driver = null) => {
    setSelectedDriver(driver);
    setIsDriverModalOpen(true);
  };

  const closeDriverModal = () => {
    setIsDriverModalOpen(false);
    setActiveSection("");
  };

  const refreshDrivers = () => {
    console.log("Atualizar lista de motoristas após alteração.");
  };

  // Funções relacionadas ao VehicleModal
  const openVehicleModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const closeVehicleModal = () => {
    setIsVehicleModalOpen(false);
    setActiveSection("");
  };

  const refreshVehicles = () => {
    console.log("Atualizar lista de veículos após alteração.");
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
      <Content
        activeSection={activeSection}
        userData={userData}
        setActiveSection={setActiveSection}
        openClientModal={openClientModal}
        openDriverModal={openDriverModal}
        openVehicleModal={openVehicleModal}
      />
      {/* Modal de Cliente */}
      {isClientModalOpen && (
        <ClientModal
          show={isClientModalOpen}
          onClose={closeClientModal}
          clientData={selectedClient} // Passando o cliente selecionado
          refreshClients={refreshClients}
        />
      )}
      {/* Modal de Motorista */}
      {isDriverModalOpen && (
        <DriverModal
          show={isDriverModalOpen}
          onClose={closeDriverModal}
          driverData={selectedDriver}
          refreshDrivers={refreshDrivers}
        />
      )}
      {/* Modal de Veículo */}
      {isVehicleModalOpen && (
        <VehicleModal
          show={isVehicleModalOpen}
          onClose={closeVehicleModal}
          vehicleData={selectedVehicle}
          refreshVehicles={refreshVehicles}
        />
      )}
    </section>
  );
};

export default Dashboard;
