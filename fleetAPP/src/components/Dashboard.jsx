import React, { useState } from "react";
import "../styles/Dashboard.css";
import DriverTable from "./DriverTable";
import ClientTable from "./ClientTable";
import FuelingTable from "./FuelingTable";
import DeliveryTable from "./DeliveryTable";
import { Sidebar } from "./Sidebar";

const Content = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case "verPerfil":
        return <h2>Exibindo o perfil...</h2>;
      case "editarPerfil":
        return <h2>Editando o perfil...</h2>;
      case "verEntregas":
        return <DeliveryTable />;
      case "criarOrdem":
        return <h2>Criando uma nova ordem...</h2>;
      case "verAbastecimentos":
        return <FuelingTable />;
      case "registrarAbastecimento":
        return <h2>Registrando um novo abastecimento...</h2>;
      case "verMotoristas":
        return <DriverTable />;
      case "cadastrarMotorista":
        return <h2>Cadastrando um motorista...</h2>;
      case "verClientes":
        return <ClientTable />;
      case "cadastrarCliente":
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
