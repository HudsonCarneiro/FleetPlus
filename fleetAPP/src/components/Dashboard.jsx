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
import FuelingModal from "./FuelingModal"; // Importa o FuelingModal
import DeliveryTable from "./DeliveryTable";
import DeliveryModal from "./DeliveryModal.jsx"; 
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
  onRequestAddDelivery,
  onRequestAddFueling, // Novo callback para o FuelingModal
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.VIEW_PROFILE:
        return <UserProfile userData={userData} />;
      case SECTIONS.VIEW_DELIVERIES:
        return <DeliveryTable />;
      case SECTIONS.CREATE_ORDER:
        onRequestAddDelivery();
        return null;
      case SECTIONS.VIEW_FUELING:
        return <FuelingTable />;
      case SECTIONS.REGISTER_FUELING:
        onRequestAddFueling(); // Chama o modal de criação de abastecimento
        return null;
      case SECTIONS.VIEW_DRIVERS:
        return <DriverTable />;
      case SECTIONS.ADD_DRIVER:
        return <p>Preparando o modal para cadastrar motorista...</p>;
      case SECTIONS.VIEW_VEHICLE:
        return <VehicleTable />;
      case SECTIONS.ADD_VEHICLE:
        return <p>Preparando o modal para cadastrar veículo...</p>;
      case SECTIONS.VIEW_CLIENTS:
        return <ClientTable />;
      case SECTIONS.ADD_CLIENT:
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
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isFuelingModalOpen, setIsFuelingModalOpen] = useState(false); // Estado para o FuelingModal
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedFueling, setSelectedFueling] = useState(null); // Estado para dados de abastecimento
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

  useEffect(() => {
    if (activeSection === SECTIONS.ADD_CLIENT) {
      setIsClientModalOpen(true);
    } else if (activeSection === SECTIONS.ADD_DRIVER) {
      setIsDriverModalOpen(true);
    } else if (activeSection === SECTIONS.ADD_VEHICLE) {
      setIsVehicleModalOpen(true);
    } else if (activeSection === SECTIONS.CREATE_ORDER) {
      setIsDeliveryModalOpen(true);
    } else if (activeSection === SECTIONS.REGISTER_FUELING) {
      setIsFuelingModalOpen(true); // Abre o FuelingModal
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

  const closeDeliveryModal = () => {
    setIsDeliveryModalOpen(false);
    setActiveSection(SECTIONS.VIEW_DELIVERIES);
  };

  const closeFuelingModal = () => {
    setIsFuelingModalOpen(false);
    setActiveSection(SECTIONS.VIEW_FUELING);
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
        onRequestAddDelivery={() => setActiveSection(SECTIONS.CREATE_ORDER)}
        onRequestAddFueling={() => setActiveSection(SECTIONS.REGISTER_FUELING)} // Callback para o FuelingModal
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
      {isDeliveryModalOpen && (
        <DeliveryModal
          show={isDeliveryModalOpen}
          onClose={closeDeliveryModal}
          deliveryData={selectedDelivery}
          refreshDeliveries={() => setActiveSection(SECTIONS.VIEW_DELIVERIES)}
          isEditMode={false}
        />
      )}
      {isFuelingModalOpen && (
        <FuelingModal
          show={isFuelingModalOpen}
          onClose={closeFuelingModal}
          fuelingData={selectedFueling}
          refreshFuelings={() => setActiveSection(SECTIONS.VIEW_FUELING)}
          isEditMode={false}
        />
      )}
    </section>
  );
};

export default Dashboard;
