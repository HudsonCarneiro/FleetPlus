import React, { useEffect, useState } from "react";
import "../styles/Table.css";
import {
  handleFetchAllMaintenances,
  handleMaintenanceDeletion,
  handleMaintenanceStatusUpdate,
} from "../controller/MaintenanceController";
import { handleExportMaintenances } from "../controller/ReportController";
import MaintenanceModal from "./MaintenanceModal";
import { toast } from "react-toastify";

const VALID_STATUS_OPTIONS = ["aberto", "parcelado", "pago"];

const MaintenanceTable = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasNoMaintenancesToastShown, setHasNoMaintenancesToastShown] = useState(false);

  const fetchMaintenancesAll = async () => {
    try {
      setLoading(true);
      const fetched = await handleFetchAllMaintenances();
      setMaintenances(fetched);

      if (fetched.length === 0 && !hasNoMaintenancesToastShown) {
        setHasNoMaintenancesToastShown(true);
        toast.info("Nenhuma manutenção encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenancesAll();
  }, []);

  const handleAddMaintenance = () => {
    setSelectedMaintenance(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteMaintenanceLocal = async (id) => {
    const confirmDelete = window.confirm("Deseja realmente excluir esta manutenção?");
    if (!confirmDelete) return;

    try {
      await handleMaintenanceDeletion(id);
      setMaintenances((prev) => prev.filter((m) => m.id !== id));
      toast.success("Manutenção excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir manutenção:", error.message);
      toast.error("Erro ao excluir manutenção.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!VALID_STATUS_OPTIONS.includes(newStatus)) {
      toast.error("Status inválido. Escolha um valor permitido.");
      return;
    }

    try {
      await handleMaintenanceStatusUpdate(id, newStatus);
      setMaintenances((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: newStatus } : m
        )
      );
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error.message);
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await handleExportMaintenances();
    } catch (error) {
      console.error("Erro ao exportar relatório:", error.message);
      toast.error("Erro ao exportar relatório.");
    } finally {
      setIsExporting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
    setIsEditMode(false);
    fetchMaintenancesAll();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "aberto":
        return "status-pending";
      case "parcelado":
        return "status-progress";
      case "pago":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <div className="maintenance-table">
      <div className="table-header">
        <h2>Manutenções</h2>
        <div className="table-actions">
          <button className="btn-add" onClick={handleAddMaintenance}>
            Adicionar Manutenção
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
              <th>Tipo</th>
              <th>Veículo</th>
              <th>Fornecedor</th>
              <th>Data</th>
              <th>Nota Fiscal</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.length > 0 ? (
              maintenances.map((m) => (
                <tr key={m.id}>
                  <td>{m.type}</td>
                  <td>{m.vehicle}</td>
                  <td>{m.provider}</td>
                  <td>{m.date}</td>
                  <td>{m.nfe}</td>
                  <td>R$ {m.price.toFixed(2)}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusClass(m.status)}`}
                      value={VALID_STATUS_OPTIONS.includes(m.status) ? m.status : "aberto"}
                      onChange={(e) => handleStatusUpdate(m.id, e.target.value)}
                    >
                      {VALID_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditMaintenance(m)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteMaintenanceLocal(m.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Nenhuma manutenção encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <MaintenanceModal
          show={isModalOpen}
          onClose={closeModal}
          maintenanceData={selectedMaintenance}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default MaintenanceTable;
