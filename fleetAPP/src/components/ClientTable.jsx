import React, { useState, useEffect } from "react";
import "../styles/ClientTable.css";
import {
  handleClientDeletion,
  handleFetchAllClients,
} from "../controller/ClientController";
import ClientModal from "./ClientModal";
import { toast } from "react-toastify";

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para carregar os clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientList = await handleFetchAllClients();
      setClients(clientList);
    } catch (error) {
      console.error("Erro ao carregar os clientes:", error);
      toast.error("Erro ao carregar a lista de clientes.");
    } finally {
      setLoading(false);
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
          setClients((prevClients) =>
            prevClients.filter((client) => client.id !== id)
          );
        } else {
          toast.error("Erro ao excluir o cliente.");
        }
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error);
        toast.error("Erro ao excluir o cliente.");
      }
    }
  };

  // Atualiza cliente no estado local após edição
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
      {loading ? (
        <p className="loading-text">Carregando...</p>
      ) : (
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
                  <td>{client.email || "Não informado"}</td>
                  <td>{client.cep || "Não informado"}</td>
                  <td>{client.city || "Não informado"}</td>
                  <td>{client.state || "Não informado"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClient(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDeleteClient(client.id, client.addressId)
                      }
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
      )}

      {isModalOpen && (
        <ClientModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          clientData={selectedClient}
          refreshClients={fetchClients}
          updateClientInState={updateClientInState}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default ClientTable;
