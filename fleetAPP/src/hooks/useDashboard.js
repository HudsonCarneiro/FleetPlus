import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData } from "../controller/DashboardController";
import { SECTIONS } from "../constants/dashboardSections.js";

const useDashboard = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isFuelingModalOpen, setIsFuelingModalOpen] = useState(false);
  const [isServiceProviderModalOpen, setIsServiceProviderModalOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedFueling, setSelectedFueling] = useState(null);
  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);

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
    switch (activeSection) {
      case SECTIONS.ADD_CLIENT:
        setIsClientModalOpen(true);
        break;
      case SECTIONS.ADD_DRIVER:
        setIsDriverModalOpen(true);
        break;
      case SECTIONS.ADD_VEHICLE:
        setIsVehicleModalOpen(true);
        break;
      case SECTIONS.CREATE_ORDER:
        setIsDeliveryModalOpen(true);
        break;
      case SECTIONS.REGISTER_FUELING:
        setIsFuelingModalOpen(true);
        break;
      case SECTIONS.REGISTER_SERVICE_PROVIDER:
        setIsServiceProviderModalOpen(true);
        break;
      default:
        break;
    }
  }, [activeSection]);

  return {
    activeSection,
    setActiveSection,
    isClientModalOpen,
    isDriverModalOpen,
    isVehicleModalOpen,
    isDeliveryModalOpen,
    isFuelingModalOpen,
    selectedClient,
    selectedDriver,
    selectedVehicle,
    selectedDelivery,
    selectedFueling,
    selectedServiceProvider,
    userData,
    loading,
    error,
    closeClientModal: () => setIsClientModalOpen(false) || setActiveSection(SECTIONS.VIEW_CLIENTS),
    closeDriverModal: () => setIsDriverModalOpen(false) || setActiveSection(SECTIONS.VIEW_DRIVERS),
    closeVehicleModal: () => setIsVehicleModalOpen(false) || setActiveSection(SECTIONS.VIEW_VEHICLE),
    closeDeliveryModal: () => setIsDeliveryModalOpen(false) || setActiveSection(SECTIONS.VIEW_DELIVERIES),
    closeFuelingModal: () => setIsFuelingModalOpen(false) || setActiveSection(SECTIONS.VIEW_FUELING),
    closeServiceProviderModal: () => setIsServiceProviderModalOpen(false) || setActiveSection(SECTIONS.VIEW_SERVICE_PROVIDERS),
  };
};

export default useDashboard;
