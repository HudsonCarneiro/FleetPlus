import React, { useState, useEffect } from "react";
import "../styles/Table.css";
import {
  handleFetchAllServiceProviders,
  handleServiceProviderDeletion,
} from "../controller/ServiceProviderController";
import ServiceProviderModal from "./ServiceProviderModal";

const ServiceProviderTable = () => {
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState(null);

  const fetchProviders = async () => {
    const fetched = await handleFetchAllServiceProviders();
    setProviders(fetched);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAddProvider = () => {
    setProviderToEdit(null);
    setShowModal(true);
  };

  const handleEditProvider = (id) => {
    const provider = providers.find((prov) => prov.id === id);
    setProviderToEdit(provider);
    setShowModal(true);
  };

  const handleDeleteProvider = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este prestador de serviço?");
    if (confirmDelete) {
      const success = await handleServiceProviderDeletion(id);
      if (success) {
        setProviders((prev) => prev.filter((prov) => prov.id !== id));
      }
    }
  };

  const refreshProviders = () => {
    fetchProviders();
  };

  return (
    <div className="driver-table">
      <div className="table-header">
        <h2>Prestadores de Serviço</h2>
        <button className="btn-add" onClick={handleAddProvider}>
          Adicionar Novo Prestador
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {providers.length > 0 ? (
            providers.map((prov) => (
              <tr key={prov.id}>
                <td>{prov.businessName}</td>
                <td>{prov.companyName}</td>
                <td>{prov.cnpj}</td>
                <td>{prov.phone || "Não informado"}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEditProvider(prov.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteProvider(prov.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                Nenhum prestador de serviço encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Cadastro/Atualização de Prestador */}
      <ServiceProviderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        providerData={providerToEdit}
        refreshProviders={refreshProviders}
      />
    </div>
  );
};

export default ServiceProviderTable;
