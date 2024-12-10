import React, { useEffect, useState } from "react";
import { fetchFuelings, deleteFueling, exportFuelingReportToTxt } from "../services/FuelingServices";
import "../styles/Table.css";
import { toast } from "react-toastify";
import FuelingModal from "./FuelingModal";

const FuelingTable = () => {
  const [fuelings, setFuelings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFueling, setSelectedFueling] = useState(null);

  useEffect(() => {
    const loadFuelings = async () => {
      try {
        setLoading(true);
        const fetchedFuelings = await fetchFuelings();
        setFuelings(fetchedFuelings);
      } catch (error) {
        console.error("Erro ao carregar abastecimentos:", error.message);
        toast.error("Erro ao carregar abastecimentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadFuelings();
  }, []);

  const handleDeleteFueling = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este abastecimento?");
    if (confirmDelete) {
      try {
        await deleteFueling(id);
        setFuelings((prev) => prev.filter((fueling) => fueling.id !== id));
        toast.success("Abastecimento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir abastecimento:", error.message);
        toast.error("Erro ao excluir abastecimento. Tente novamente.");
      }
    }
  };

  const handleAddFueling = () => {
    setSelectedFueling(null);
    setIsModalOpen(true);
  };

  const handleEditFueling = (fueling) => {
    setSelectedFueling(fueling);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFueling(null);
  };

  return (
    <div className="fueling-table">
      <div className="table-header">
        <h2>Abastecimentos</h2>
        <div>
          <button className="btn-add" onClick={handleAddFueling}>
            Adicionar Novo Abastecimento
          </button>
          <button className="btn-export" onClick={exportFuelingReportToTxt}>
            Exportar Relatório
          </button>
        </div>
      </div>
      {loading ? (
        <p>Carregando...</p>
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
                  <td>{fueling.Driver?.name || "Não informado"}</td>
                  <td>
                    {fueling.Vehicle
                      ? `${fueling.Vehicle.model} (${fueling.Vehicle.licensePlate})`
                      : "Não informado"}
                  </td>
                  <td>{Number(fueling.liters || 0).toFixed(2)} L</td>
                  <td>R$ {Number(fueling.price || 0).toFixed(2)}</td>
                  <td>{Number(fueling.mileage || 0).toFixed(2)} km</td>
                  <td>
                    {fueling.dateFueling
                      ? new Date(fueling.dateFueling).toLocaleDateString()
                      : "Não definida"}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditFueling(fueling)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteFueling(fueling.id)}>
                      Excluir
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
        <FuelingModal show={isModalOpen} onClose={closeModal} fuelingData={selectedFueling} />
      )}
    </div>
  );
};

export default FuelingTable;
