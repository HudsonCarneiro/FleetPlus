import React, { useState } from "react";
import "../styles/FuelingTable.css";

const FuelingTable = () => {
  // Dados fictícios para simular a tabela
  const [fuelings, setFuelings] = useState([
    {
      id: 1,
      driver: "João Silva",
      vehicle: "Caminhão ABC-1234",
      liters: 50.75,
      price: 300.50,
      mileage: 150000,
      dateFueling: "2024-11-20",
    },
    {
      id: 2,
      driver: "Maria Souza",
      vehicle: "Van XYZ-5678",
      liters: 30.00,
      price: 180.00,
      mileage: 80000,
      dateFueling: "2024-11-21",
    },
  ]);

  // Função para adicionar um novo abastecimento
  const handleAddFueling = () => {
    console.log("Adicionar novo abastecimento");
    // Aqui você pode abrir um modal ou redirecionar para um formulário.
  };

  // Função para editar um abastecimento
  const handleEditFueling = (id) => {
    console.log(`Editar abastecimento com ID: ${id}`);
    // Aqui você pode abrir um modal ou carregar o formulário com dados.
  };

  // Função para deletar um abastecimento
  const handleDeleteFueling = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este abastecimento?");
    if (confirmDelete) {
      setFuelings((prevFuelings) => prevFuelings.filter((fueling) => fueling.id !== id));
    }
  };

  return (
    <div className="fueling-table">
      <div className="table-header">
        <h2>Abastecimentos</h2>
        <button className="btn-add" onClick={handleAddFueling}>
          Adicionar Novo Abastecimento
        </button>
      </div>
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
                <td>{fueling.driver}</td>
                <td>{fueling.vehicle}</td>
                <td>{fueling.liters.toFixed(2)} L</td>
                <td>R$ {fueling.price.toFixed(2)}</td>
                <td>{fueling.mileage.toFixed(2)} km</td>
                <td>{new Date(fueling.dateFueling).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditFueling(fueling.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteFueling(fueling.id)}
                  >
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
    </div>
  );
};

export default FuelingTable;
