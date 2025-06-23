import React from "react";
import { Sidebar } from "./Sidebar";
import Content from "./DashboardContent";
import ClientModal from "./ClientModal";
import DriverModal from "./DriverModal";
import VehicleModal from "./VehicleModal";
import DeliveryModal from "./DeliveryModal";
import FuelingModal from "./FuelingModal";
import MaintenanceModal from './MaintenanceModal';
import ServiceProviderModal from "./ServiceProviderModal";
import useDashboard from "../hooks/useDashboard";
import { SECTIONS } from "../constants/dashboardSections";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const {
    activeSection,
    setActiveSection,
    isClientModalOpen,
    isDriverModalOpen,
    isVehicleModalOpen,
    isDeliveryModalOpen,
    isFuelingModalOpen,
    isServiceProviderModalOpen,
    isMaintenanceModalOpen,

    selectedClient,
    selectedDriver,
    selectedVehicle,
    selectedDelivery,
    selectedFueling,
    selectedServiceProvider,
    selectedMaintenance,

    userData,
    loading,
    error,
    closeClientModal,
    closeDriverModal,
    closeVehicleModal,
    closeDeliveryModal,
    closeFuelingModal,
    closeServiceProviderModal,
    closeMaintenanceModal,
  } = useDashboard();

  if (loading) return <p>Carregando...</p>;
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar Novamente</button>
      </div>
    );
  if (!userData) return <p>Erro ao carregar os dados do usuário.</p>;

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
        onRequestAddFueling={() => setActiveSection(SECTIONS.REGISTER_FUELING)}
        onRequestAddServiceProvider={() => setActiveSection(SECTIONS.ADD_SERVICE_PROVIDER)}
        onRequestAddMaintenance={() => setActiveSection(SECTIONS.REGISTER_MAINTENANCE)}
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
      {isServiceProviderModalOpen && (
        <ServiceProviderModal
          show={isServiceProviderModalOpen}
          onClose={closeServiceProviderModal}
          ServiceProviderData={selectedServiceProvider}
          refreshServiceProviders={() => setActiveSection(SECTIONS.VIEW_SERVICE_PROVIDERS)}
          isEditMode={false}
        />
      )}
      {isMaintenanceModalOpen && (
        <MaintenanceModal
          show={isMaintenanceModalOpen}
          onClose={closeMaintenanceModal}
          MaintenanceData={selectedMaintenance}
          refreshMaintenances={() => setActiveSection(SECTIONS.VIEW_MAINTENANCE)}
          isEditMode={false}
        />
      )}
    </section>
  );
};

export default Dashboard;
