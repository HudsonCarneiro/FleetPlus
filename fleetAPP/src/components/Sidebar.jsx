import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    {
      title: "Meu Perfil",
      links: [{ label: "Ver Perfil", section: "verPerfil" }],
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
      title: "Veículos",
      links: [
        { label: "Ver Veículos", section: "verVeiculos" },
        { label: "Cadastrar Veículo", section: "cadastrarVeiculo" },
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

  const handleSectionChange = (section) => {
    if (section !== activeSection) {
      // Apenas atualiza o estado se a seção for diferente
      setActiveSection(section);
    }
  };

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
              onClick={() => handleSectionChange(link.section)}
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
