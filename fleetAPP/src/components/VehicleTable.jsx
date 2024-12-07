import React, { useState, useEffect } from "react";
import "../styles/Table.css";
import { 
  handleFetchAllVehicles, 
  handleVehicleDeletion,
} from "../controller/VehicleController.js"; 
import VehicleModal from "./VehicleModal"; 

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [driverToEdit, setDriverToEdit] = useState(null); 

  // Função para carregar os veic
  const fetchVehicle = async () => {
    const fetchedVehicles = await handleFetchAllVehicles(); 
    setVehicles(fetchedVehicles); 
  };

  // Efeito para buscar os veiculos ao carregar o componente
  useEffect(() => {
    fetchVehicles();
  }, []); // O array vazio garante que a função seja chamada apenas uma vez, após o primeiro render

  const handleAddVehicles = () => {
    setVehicleToEdit(null); // Limpa os dados do veiculo para adicionar um novo
    setShowModal(true); // Exibe o modal
  };

  const handleEditDriver = (id) => {
    const vehicle = vehicles.find((vehicle) => vehicle.id === id); // Encontra o veiculo a ser editado
    setDriverToEdit(vehicle); // Atualiza o estado com os dados do veiculo para edição
    setShowModal(true); // Exibe o modal
  };

  const handleDeleteDriver = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este motorista?");
    if (confirmDelete) {
      const success = handleDriverDeletion(id);
      if (success) {
        setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id)); // Atualiza o estado após a exclusão
      }
    }
  };

  const refreshDrivers = () => {
    fetchDrivers(); // Atualiza a lista de motoristas após uma alteração
  };

  return (
    <div className="driver-table">
      <div className="table-header">
        <h2>Veículos</h2>
        <button className="btn-add" onClick={handleAddDriver}>
          Adicionar Novo Motorista
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Plca</th>
            <th>Modelo</th>
            <th>Montadora</th>
            <th>Ano</th>
            <th>Combustível</th>
            <th>Quilometragem</th>
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

      {/* Modal de Cadastro/Atualização de Motorista */}
      <DriverModal
        show={showModal}
        onClose={() => setShowModal(false)} // Função para fechar o modal
        driverData={driverToEdit} // Passa os dados do motorista para o modal
        refreshDrivers={refreshDrivers} // Passa a função para atualizar a lista de motoristas
      />
    </div>
  );
};

export default VehicleTable;
