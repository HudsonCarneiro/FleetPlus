import React, { useState } from "react";
import "../styles/DeliveryTable.css";

const DeliveryTable = () => {
  // Dados fictícios
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      client: "Empresa A",
      driver: "João Silva",
      vehicle: "Caminhão ABC-1234",
      deliveryDate: "2024-11-25",
      status: "aguardando",
    },
    {
      id: 2,
      client: "Empresa B",
      driver: "Maria Souza",
      vehicle: "Van XYZ-5678",
      deliveryDate: "2024-11-26",
      status: "enviado",
    },
  ]);

  // Função para adicionar nova ordem de entrega
  const handleAddOrder = () => {
    console.log("Adicionar nova ordem de entrega");
    // Aqui você pode abrir um modal ou redirecionar para um formulário.
  };

  // Função para editar ordem de entrega
  const handleEditOrder = (id) => {
    console.log(`Editar ordem de entrega com ID: ${id}`);
    // Aqui você pode abrir um modal ou carregar o formulário com dados.
  };

  // Função para excluir ordem de entrega
  const handleDeleteOrder = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta ordem de entrega?");
    if (confirmDelete) {
      setDeliveries((prevDeliveries) => prevDeliveries.filter((delivery) => delivery.id !== id));
    }
  };

  return (
    <div className="delivery-table">
      <div className="table-header">
        <h2>Ordens de Entrega</h2>
        <button className="btn-add" onClick={handleAddOrder}>
          Adicionar Nova Ordem
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Motorista</th>
            <th>Veículo</th>
            <th>Data da Entrega</th>
            <th>Status</th>
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
                <td>
                  {delivery.deliveryDate
                    ? new Date(delivery.deliveryDate).toLocaleDateString()
                    : "Não definida"}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      delivery.status === "aguardando"
                        ? "status-pending"
                        : delivery.status === "enviado"
                        ? "status-sent"
                        : "status-completed"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditOrder(delivery.id)}
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
              <td colSpan="6" className="no-data">
                Nenhuma ordem de entrega encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;
