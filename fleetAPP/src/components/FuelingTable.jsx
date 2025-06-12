import React, { useEffect, useState } from "react";
import {
  handleFetchAllFuelings,
  handleFetchFuelingById,
} from "../controller/FuelingController";
import { exportFuelingsToPDF } from "../services/FuelingServices";
import FuelingModal from "./FuelingModal";
import "../styles/Table.css";

const FuelingTable = () => {
  const [fuelings, setFuelings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFueling, setSelectedFueling] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNoFuelingsToastShown, setHasNoFuelingsToastShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchFuelings = async () => {
    try {
      setLoading(true);
      const fetchedFuelings = await handleFetchAllFuelings();
      setFuelings(fetchedFuelings);

      if (fetchedFuelings.length === 0 && !hasNoFuelingsToastShown) {
        setHasNoFuelingsToastShown(true);
      }
    } catch (error) {
      console.log("Nenhum abastecimento encontrado ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelings();
  }, []);

  const handleAddFueling = () => {
    setSelectedFueling(null);
    setIsModalOpen(true);
  };

  const handleEditFueling = (fueling) => {
    setSelectedFueling(fueling);
    setIsModalOpen(true);
  };

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await exportFuelingsToPDF();
    } catch (error) {
      console.error("Erro ao exportar relatório:", error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFueling(null);
    fetchFuelings();
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
              <th>Preço Total</th>
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
