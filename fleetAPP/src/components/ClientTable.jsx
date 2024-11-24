import React, { useState } from "react";
import "../styles/ClientTable.css";

const ClientTable = () => {
  // Dados fictícios para simular a tabela
  const [clients, setClients] = useState([
    {
      id: 1,
      businessName: "Empresa Alpha",
      companyName: "Alpha S.A.",
      cnpj: "12345678000199",
      phone: "1133334444",
      email: "contato@empresaalpha.com",
    },
    {
      id: 2,
      businessName: "Empresa Beta",
      companyName: "Beta LTDA",
      cnpj: "98765432000188",
      phone: "2199998888",
      email: "contato@empresabeta.com",
    },
  ]);

  // Função para adicionar um novo cliente
  const handleAddClient = () => {
    console.log("Adicionar novo cliente");
    // Aqui você pode abrir um modal ou redirecionar para um formulário.
  };

  // Função para editar um cliente
  const handleEditClient = (id) => {
    console.log(`Editar cliente com ID: ${id}`);
    // Aqui você pode abrir um modal ou carregar o formulário com dados.
  };

  // Função para deletar um cliente
  const handleDeleteClient = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (confirmDelete) {
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
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
      <table>
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>E-mail</th>
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
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClient(client.id)}
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
              <td colSpan="6" className="no-data">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
