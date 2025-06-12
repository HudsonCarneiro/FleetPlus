import React, { useState, useEffect } from "react";
import "../styles/DeliveryTable.css";
import {
  handleFetchAllDeliveryOrders,
  handleDeliveryOrderDeletion,
  handleDeliveryOrderStatusUpdate,
  handleExportDeliveryOrdersToPDF, 
} from "../controller/DeliveryOrderController";
import DeliveryModal from "./DeliveryModal.jsx";
import { toast } from "react-toastify";

const DeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasNoDeliveriesToastShown, setHasNoDeliveriesToastShown] = useState(false);

  // Função para buscar todas as ordens de entrega
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const fetchedDeliveries = await handleFetchAllDeliveryOrders();
      setDeliveries(fetchedDeliveries);

      if (fetchedDeliveries.length === 0 && !hasNoDeliveriesToastShown) {
        toast.info("Nenhuma ordem de entrega cadastrada.");
        setHasNoDeliveriesToastShown(true);
      }
    } catch (error) {
      console.error("Erro ao carregar ordens de entrega:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Função para abrir o modal de criação
  const handleAddOrder = () => {
    setSelectedDelivery(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Função para exportar o relatório de entregas
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await handleExportDeliveryOrdersToPDF(); // Chamando o controlador correto
    } catch (error) {
      console.error("Erro ao gerar relatório de entregas:", error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para abrir o modal de edição
  const handleEditOrder = (delivery) => {
    setSelectedDelivery(delivery);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Função para excluir uma ordem de entrega
  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta ordem de entrega?"
    );
    if (confirmDelete) {
      try {
        await handleDeliveryOrderDeletion(id);
        setDeliveries((prevDeliveries) =>
          prevDeliveries.filter((delivery) => delivery.id !== id)
        );
        toast.success("Ordem de entrega excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir ordem de entrega:", error.message);
        toast.error("Erro ao excluir ordem de entrega. Tente novamente.");
      }
    }
  };

  // Função para alterar o status de uma ordem de entrega
  const handleStatusUpdate = async (id, status) => {
    try {
      await handleDeliveryOrderStatusUpdate(id, status);
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, status } : delivery
        )
      );
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status da ordem de entrega:", error.message);
      toast.error("Erro ao atualizar status. Tente novamente.");
    }
  };

  return (
    <div className="delivery-table">
      <div className="table-header">
        <h2>Ordens de Entrega</h2>
        <div className="table-actions">
          <button className="btn-add" onClick={handleAddOrder}>
            Adicionar Nova Ordem
          </button>
          <button
            className="btn-export"
            onClick={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? "Exportando..." : "Exportar Relatório"}
          </button>
        </div>
      </div>
      {loading ? (
        <p className="loading-text">Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Data da Entrega</th>
              <th>Status</th>
              <th>Urgência</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{delivery.client}</td>
                  <td>{delivery.driver}</td>
                  <td>{delivery.vehicle}</td>
                  <td>{delivery.deliveryDate}</td>
                  <td>
                    <select
                      className={`status-select ${
                        delivery.status === "aguardando"
                          ? "status-pending"
                          : delivery.status === "enviado"
                          ? "status-sent"
                          : "status-completed"
                      }`}
                      value={delivery.status}
                      onChange={(e) =>
                        handleStatusUpdate(delivery.id, e.target.value)
                      }
                    >
                      <option value="aguardando">Aguardando</option>
                      <option value="enviado">Enviado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </td>
              
                  <td>{delivery.urgency}</td>



                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditOrder(delivery)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteOrder(delivery.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Nenhuma ordem de entrega encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <DeliveryModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          deliveryData={selectedDelivery}
          refreshDeliveries={fetchDeliveries}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}

export default DeliveryTable;
