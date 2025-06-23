import React, { useState, useEffect } from "react";
import "../styles/MaintenanceTable.css";
import {
  handleFetchAllMaintenances,
  handleMaintenanceDeletion,
  handleMaintenanceStatusUpdate,
  handleExportMaintenancesToPDF,
} from "../controller/MaintenanceController";
import MaintenanceModal from "./MaintenanceModal";
import { toast } from "react-toastify";

const MaintenanceTable = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await handleFetchAllMaintenances();
      setMaintenances(data);
      if (data.length === 0) toast.info("Nenhuma manutenção encontrada.");
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
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

  const handleDeleteMaintenance = async (id) => {
    const confirm = window.confirm("Deseja realmente excluir esta manutenção?");
    if (confirm) {
      try {
        await handleMaintenanceDeletion(id);
        setMaintenances((prev) =>
          prev.filter((maintenance) => maintenance.id !== id)
        );
      } catch (error) {
        console.error("Erro ao excluir manutenção:", error.message);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await handleMaintenanceStatusUpdate(id, status);
      setMaintenances((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status } : m
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error.message);
    }
  };

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await handleExportMaintenancesToPDF();
    } catch (error) {
      console.error("Erro ao exportar relatório:", error.message);
    } finally {
      setIsExporting(false);
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
                  <td>{m.price}</td>
                  <td>
                    <select
                      className={`status-select ${
                        m.status === "pendente"
                          ? "status-pending"
                          : m.status === "em andamento"
                          ? "status-progress"
                          : "status-completed"
                      }`}
                      value={m.status}
                      onChange={(e) =>
                        handleStatusUpdate(m.id, e.target.value)
                      }
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em andamento">Em andamento</option>
                      <option value="finalizado">Finalizado</option>
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
                      onClick={() => handleDeleteMaintenance(m.id)}
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
          onClose={() => setIsModalOpen(false)}
          maintenanceData={selectedMaintenance}
          refreshMaintenances={fetchMaintenances}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default MaintenanceTable;
