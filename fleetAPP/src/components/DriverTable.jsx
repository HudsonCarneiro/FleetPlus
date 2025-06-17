import React, { useState, useEffect } from "react";
import "../styles/Table.css";
import { 
  handleFetchAllDrivers, 
  handleDriverDeletion,
} from "../controller/DriverController.js"; 
import DriverModal from "./DriverModal"; 

const DriverTable = () => {
  const [drivers, setDrivers] = useState([]); // Inicialize o estado como um array vazio
  const [showModal, setShowModal] = useState(false); // Estado para controlar a exibição do modal
  const [driverToEdit, setDriverToEdit] = useState(null); // Estado para controlar os dados do motorista a ser editado

  // Função para carregar os motoristas
  const fetchDrivers = async () => {
    const fetchedDrivers = await handleFetchAllDrivers(); // Chama a função para buscar os motoristas
    setDrivers(fetchedDrivers); // Atualiza o estado com os motoristas reais
  };

  // Efeito para buscar os motoristas ao carregar o componente
  useEffect(() => {
    fetchDrivers();
  }, []); // O array vazio garante que a função seja chamada apenas uma vez, após o primeiro render

  const handleAddDriver = () => {
    setDriverToEdit(null); // Limpa os dados do motorista para adicionar um novo
    setShowModal(true); // Exibe o modal
  };

  const handleEditDriver = (id) => {
    const driver = drivers.find((driver) => driver.id === id); // Encontra o motorista a ser editado
    setDriverToEdit(driver); // Atualiza o estado com os dados do motorista para edição
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

export default DriverTable;
