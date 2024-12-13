import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  handleFetchAllFuelings,
  handleFetchFuelingById,
} from "../controller/FuelingController";
import { exportFuelingReportToTxt } from "../services/FuelingServices";
import FuelingModal from "./FuelingModal";
import "../styles/Table.css";

const FuelingTable = () => {
  const [fuelings, setFuelings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFueling, setSelectedFueling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNoFuelingsToastShown, setHasNoFuelingsToastShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Função para buscar abastecimentos
  const fetchFuelings = async () => {
    try {
      setLoading(true);
      const fetchedFuelings = await handleFetchAllFuelings();
      setFuelings(fetchedFuelings);

      if (fetchedFuelings.length === 0 && !hasNoFuelingsToastShown) {
        toast.info("Nenhum abastecimento cadastrado.");
        setHasNoFuelingsToastShown(true);
      }
    } catch (error) {
      console.error("Erro ao carregar abastecimentos:", error.message);
      toast.error("Erro ao carregar abastecimentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelings();
  }, []);

  // Adicionar um novo abastecimento
  const handleAddFueling = () => {
    setSelectedFueling(null);
    setIsModalOpen(true);
  };

  // Editar um abastecimento existente
  const handleEditFueling = (fueling) => {
    setSelectedFueling(fueling);
    setIsModalOpen(true);
  };

  // Exportar relatório
  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await exportFuelingReportToTxt();
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar relatório:", error.message);
      toast.error("Erro ao exportar relatório. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFueling(null);
    fetchFuelings(); // Atualizar lista após edição/adição
  };

  return (
    <div className="fueling-table">
      <div className="table-header">
        <h2>Abastecimentos</h2>
        <div className="table-actions">
          <button className="btn-add" onClick={handleAddFueling}>
            Adicionar Novo Abastecimento
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
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Litros</th>
              <th>Preço</th>
              <th>Quilometragem</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fuelings.length > 0 ? (
              fuelings.map((fueling) => (
                <tr key={fueling.id}>
                  <td>{fueling.driver || "Não informado"}</td>
                  <td>{fueling.vehicle || "Não informado"}</td>
                  <td>{Number(fueling.liters || 0).toFixed(2)} L</td>
                  <td>R$ {Number(fueling.price || 0).toFixed(2)}</td>
                  <td>{Number(fueling.mileage || 0).toFixed(2)} km</td>
                  <td>
                    {fueling.dateFueling
                      ? new Date(fueling.dateFueling).toLocaleDateString()
                      : "Não definida"}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditFueling(fueling)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Nenhum abastecimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <FuelingModal
          show={isModalOpen}
          onClose={closeModal}
          fuelingData={selectedFueling}
        />
      )}
    </div>
  );
};

export default FuelingTable;
