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
      const clientList = await handleFetchAllClients(); // Função que chama o serviço
      console.log("Clientes recebidos:", clientList); // Log para depuração
      setClients(clientList); // Atualiza o estado com os clientes
    } catch (error) {
      console.error("Erro ao carregar os clientes:", error.message);
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
  const handleDeleteClient = async (id) => {
    if (!id) {
      toast.error("Dados do cliente inválidos.");
      return;
    }

    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (confirmDelete) {
      try {
        await handleClientDeletion(id);
        toast.success("Cliente excluído com sucesso!");
        fetchClients(); // Recarrega a lista de clientes após exclusão
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error.message);
        toast.error("Erro ao excluir o cliente.");
      }
    }
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
                  <td>{client.phone}</td>
                  <td>{client.email}</td>
                  <td>{client.address?.cep || "Não informado"}</td>
                  <td>{client.address?.city || "Não informado"}</td>
                  <td>{client.address?.state || "Não informado"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClient(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClient(client.id)}
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
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default ClientTable;
