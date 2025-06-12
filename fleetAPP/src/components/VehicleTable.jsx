import React, { useState, useEffect } from "react";
import "../styles/Table.css";
import { 
  handleFetchAllVehicles, 
  handleVehicleDeletion,
  handleExportVehiclesReport,
} from "../controller/VehicleController.js"; 
import VehicleModal from "./VehicleModal"; 
import { exportVehiclesReport } from "../services/VehicleServices";

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [vehicleToEdit, setVehicleToEdit] = useState(null); 

  // Função para carregar os veículos
  const fetchVehicles = async () => {
    const fetchedVehicles = await handleFetchAllVehicles(); 
    setVehicles(fetchedVehicles); 
  };

  // Efeito para buscar os veículos ao carregar o componente
  useEffect(() => {
    fetchVehicles();
  }, []); // O array vazio garante que a função seja chamada apenas uma vez, após o primeiro render

  const handleAddVehicle = () => {
    setVehicleToEdit(null); // Limpa os dados do veículo para adicionar um novo
    setTimeout(() => setShowModal(true), 0); // Garante que o modal será aberto após a limpeza
  };

  const handleEditVehicle = (id) => {
    const vehicle = vehicles.find((vehicle) => vehicle.id === id); // Encontra o veículo a ser editado
    setVehicleToEdit(vehicle); // Atualiza o estado com os dados do veículo para edição
    setShowModal(true); // Exibe o modal
  };

  const handleDeleteVehicle = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este veículo?");
    if (confirmDelete) {
      const success = await handleVehicleDeletion(id);
      if (success) {
        setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== id)); // Atualiza o estado após a exclusão
      }
    }
  };

  const refreshVehicles = () => {
    fetchVehicles(); // Atualiza a lista de veículos após uma alteração
  };

  return (
    <div>
      <div className="table-header">
        <h2>Veículos</h2>
        <button className="btn-add" onClick={handleAddVehicle}>
          Adicionar Novo Veículo
        </button>
        <button className="btn-export" onClick={handleExportVehiclesReport}>
            Exportar Relatório
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Montadora</th>
            <th>Ano</th>
            <th>Combustível</th>
            <th>Quilometragem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.plate}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.automaker}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.fuelType}</td>
                <td>{vehicle.mileage}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditVehicle(vehicle.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                Nenhum veículo encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Cadastro/Atualização de Veículo */}
      <VehicleModal
        show={showModal}
        onClose={() => setShowModal(false)} // Função para fechar o modal
        vehicleData={vehicleToEdit} // Passa os dados do veículo para o modal
        refreshVehicles={refreshVehicles} // Passa a função para atualizar a lista de veículos
      />
    </div>
  );
};

export default VehicleTable;
