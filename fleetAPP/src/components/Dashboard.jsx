import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import UserProfile from "./UserProfile";
import UserModal from "./UserModal";
import DriverTable from "./DriverTable";
import DriverModal from "./DriverModal"; // Importação do modal de motorista
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

const Content = ({ activeSection, userData, setActiveSection, openDriverModal }) => {
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
        openDriverModal(); // Abre o modal ao acessar esta seção
        return null; // Nenhum conteúdo é exibido, pois o modal será responsável pela interação
      case SECTIONS.VIEW_VEHICLE:
        return <h2>Exibindo veiculos.</h2>;
      case SECTIONS.ADD_VEHICLE:
        return <h2>Cadastrando um novo veiculo...</h2>;
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
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null); // Para edição de motorista
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    fetchDashboardData(setUserData, setLoading, navigate);
  }, [navigate]);

  const openDriverModal = (driver = null) => {
    setSelectedDriver(driver); // Define o motorista selecionado (ou null para cadastro)
    setIsDriverModalOpen(true);
  };

  const closeDriverModal = () => {
    setIsDriverModalOpen(false);
    setActiveSection(""); // Reseta a seção ativa ao fechar o modal
  };

  const refreshDrivers = () => {
    console.log("Atualizar lista de motoristas após alteração.");
    // Aqui você pode adicionar lógica para recarregar os dados da tabela de motoristas
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
        openDriverModal={openDriverModal}
      />
      {isDriverModalOpen && (
        <DriverModal
          show={isDriverModalOpen}
          onClose={closeDriverModal}
          driverData={selectedDriver}
          refreshDrivers={refreshDrivers}
        />
      )}
    </section>
  );
};

export default Dashboard;
