import React from "react";
import UserProfile from "./UserProfile";
import VehicleTable from "./VehicleTable";
import DriverTable from "./DriverTable";
import ClientTable from "./ClientTable";
import FuelingTable from "./FuelingTable";
import DeliveryTable from "./DeliveryTable";
import { SECTIONS } from "../constants/dashboardSections.js";

const Content = ({
  activeSection,
  userData,
  onRequestAddCompany,
  onRequestAddClient,
  onRequestAddDriver,
  onRequestAddVehicle,
  onRequestAddDelivery,
  onRequestAddFueling,
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
        onRequestAddFueling();
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

export default Content;
