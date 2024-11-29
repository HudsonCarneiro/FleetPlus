import React, { useState } from "react";
import "../styles/Dashboard.css";
import DriverTable from "./DriverTable";
import ClientTable from "./ClientTable";
import FuelingTable from "./FuelingTable";
import DeliveryTable from "./DeliveryTable";
import { Sidebar } from "./Sidebar";

const SECTIONS = {
  VIEW_PROFILE: "verPerfil",
  EDIT_PROFILE: "editarPerfil",
  VIEW_DELIVERIES: "verEntregas",
  CREATE_ORDER: "criarOrdem",
  VIEW_FUELING: "verAbastecimentos",
  REGISTER_FUELING: "registrarAbastecimento",
  VIEW_DRIVERS: "verMotoristas",
  ADD_DRIVER: "cadastrarMotorista",
  VIEW_CLIENTS: "verClientes",
  ADD_CLIENT: "cadastrarCliente",
};

const Content = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case SECTIONS.VIEW_PROFILE:
        return <h2>Exibindo o perfil...</h2>;
      case SECTIONS.EDIT_PROFILE:
        return <h2>Editando o perfil...</h2>;
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
        return <p>Selecione uma opção no menu para ver os detalhes.</p>;
    }
  };

  return <div className="content">{renderContent()}</div>;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <section className="main">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Content activeSection={activeSection} />
    </section>
  );
};

export default Dashboard;
