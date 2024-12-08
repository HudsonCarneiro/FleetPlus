import React, { useState, useEffect } from "react";
import "../styles/ClientTable.css";
import { handleFetchClientById, handleClientDeletion, handleFetchAllClients } from "../controller/ClientController"; 
import ClientModal from "./ClientModal";
import { toast } from "react-toastify"; // Para exibir mensagens visuais

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Função para carregar os clientes
  const fetchClients = async () => {
    try {
      const clientList = await handleFetchAllClients(); // Obtém todos os clientes da API
      setClients(clientList);
    } catch (error) {
      console.error("Erro ao carregar os clientes:", error);
      toast.error("Erro ao carregar a lista de clientes.");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Função para abrir o modal de edição
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Função para abrir o modal de criação
  const handleAddClient = () => {
    setSelectedClient(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Função para excluir um cliente
  const handleDeleteClient = async (id, addressId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (confirmDelete) {
      try {
        const deleted = await handleClientDeletion(id, addressId);
        if (deleted) {
          toast.success("Cliente excluído com sucesso!");
          setClients((prevClients) => prevClients.filter((client) => client.id !== id)); // Atualiza localmente
        } else {
          toast.error("Erro ao excluir o cliente.");
        }
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error);
        toast.error("Erro ao excluir o cliente.");
      }
    }
  };

  // Atualiza a lista de clientes localmente após edição
  const updateClientInState = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  return (
    <div className="client-table">
      <div className="table-header">
        <h2>Clientes</h2>
        <button className="btn-add" onClick={handleAddClient}>
          Adicionar Novo Cliente
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>CEP</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.businessName}</td>
                <td>{client.companyName}</td>
                <td>{client.cnpj}</td>
                <td>{client.phone || "Não informado"}</td>
                <td>{client.email}</td>
                <td>{client.cep}</td>
                <td>{client.city}</td>
                <td>{client.state}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClient(client)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClient(client.id, client.addressId)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <ClientModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          clientData={selectedClient}
          refreshClients={fetchClients} // Ainda é usado para criar um cliente
          updateClientInState={updateClientInState} // Passa para atualizar localmente após edição
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default ClientTable;
