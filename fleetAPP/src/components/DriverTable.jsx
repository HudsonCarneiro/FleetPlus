import React, { useState } from "react";
import "../styles/DriverTable.css";

const DriverTable = () => {
  // Dados fictícios para simular a tabela
  const [drivers, setDrivers] = useState([
    { id: 1, name: "João Silva", cnh: "12345678911", phone: "11999999999" },
    { id: 2, name: "Maria Souza", cnh: "98765432111", phone: "21988888888" },
  ]);

  // Função para adicionar um novo motorista (a ser integrada com o backend)
  const handleAddDriver = () => {
    console.log("Adicionar novo motorista");
    // Aqui você pode abrir um modal ou redirecionar para um formulário.
  };

  // Função para editar um motorista
  const handleEditDriver = (id) => {
    console.log(`Editar motorista com ID: ${id}`);
    // Aqui você pode abrir um modal ou carregar o formulário com dados.
  };

  // Função para deletar um motorista
  const handleDeleteDriver = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este motorista?");
    if (confirmDelete) {
      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
    }
  };

  return (
    <div className="driver-table">
      <div className="table-header">
        <h2>Motoristas</h2>
        <button className="btn-add" onClick={handleAddDriver}>
          Adicionar Novo Motorista
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNH</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.cnh}</td>
                <td>{driver.phone || "Não informado"}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditDriver(driver.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                Nenhum motorista encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
