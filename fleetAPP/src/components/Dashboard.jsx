import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import DriverTable from "./DriverTable";
import ClientTable from "./ClientTable";
import FuelingTable from "./FuelingTable";
import DeliveryTable from "./DeliveryTable";

const Sidebar = ({ activeSection, setActiveSection }) => {

  const menuItems = [
    { 
      title: "Meu Perfil",
      links: [
        { label: "Ver Perfil", section: "verPerfil" },
        { label: "Editar Perfil", section: "editarPerfil" },
      ],
    },
    {
      title: "Ordem de Entrega",
      links: [
        { label: "Ver Entregas", section: "verEntregas" },
        { label: "Criar Ordem", section: "criarOrdem" },
      ],
    },
    {
      title: "Abastecimentos",
      links: [
        { label: "Ver Abastecimentos", section: "verAbastecimentos" },
        { label: "Registrar Abastecimento", section: "registrarAbastecimento" },
      ],
    },
    {
      title: "Motoristas",
      links: [
        { label: "Ver Motoristas", section: "verMotoristas" },
        { label: "Cadastrar Motorista", section: "cadastrarMotorista" },
      ],
    },
    {
      title: "Clientes",
      links: [
        { label: "Ver Clientes", section: "verClientes" },
        { label: "Cadastrar Cliente", section: "cadastrarCliente" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {menuItems.map((menu, index) => (
        <div key={index} className="sectionContainer">
          <h5 className="text-muted title-font">{menu.title}</h5>
          {menu.links.map((link, linkIndex) => (
            <Link
              key={linkIndex}
              to="#"
              className={`link-font ${activeSection === link.section ? "active" : ""}`}
              onClick={() => setActiveSection(link.section)}
            >
              {link.label}
            </Link>
          ))}
          <div className="separator"></div>
        </div>
      ))}
    </div>
  );
};

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
