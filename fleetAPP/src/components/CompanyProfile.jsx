import React, { useEffect, useState } from "react";
import CompanyModal from "./CompanyModal";
import { toast } from "react-toastify";
import "../styles/Profile.css";
import {
  handleFetchCompanyByUser,
  handleCompanyDeletion,
} from "../controller/CompanyController";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await handleFetchCompanyByUser();
        if (company) {
          setCompanyData(company);
        } else {
          setCompanyData(null);
        }
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);

        if (error?.response?.status === 500) {
          toast.error("Erro interno no servidor. Tente novamente mais tarde.");
        } else if (error?.message?.includes("Network")) {
          toast.error("Erro de conexão. Verifique sua internet.");
        } else {
          toast.error("Erro inesperado ao buscar os dados da empresa.");
        }
      }
    };

    fetchCompany();
  }, []);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = async () => {
    if (!companyData?.id) return;
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta empresa? Essa ação não pode ser desfeita."
    );
    if (!confirmDelete) return;

    try {
      await handleCompanyDeletion(companyData.id);
      toast.success("Empresa excluída com sucesso.");
      setCompanyData(null);
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);

      if (error?.response?.status === 500) {
        toast.error("Erro interno ao excluir a empresa.");
      } else {
        toast.error("Erro inesperado ao excluir a empresa.");
      }
    }
  };

  return (
    <div className="container mt-5 pt-5">
      {!companyData ? (
        <div className="alert alert-warning text-center">
          Nenhuma empresa vinculada ao seu usuário.
        </div>
      ) : (
        <div className="card p-4">
          <div className="card-body">
            <h3 className="text-center">Perfil da Empresa</h3>
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nome Fantasia</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.businessName}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Razão Social</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.companyName}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CNPJ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.cnpj}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.cep || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rua</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.road || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Número</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.number || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Complemento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.complement || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cidade</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.city || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyData.address?.state || ""}
                    readOnly
                  />
                </div>
              </div>
            </form>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={handleDeleteClick}>
                Excluir Empresa
              </button>
              <button className="btn btn-primary" onClick={handleEditClick}>
                Editar Empresa
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CompanyModal
          show={isModalOpen}
          onClose={() => setModalOpen(false)}
          isEditMode={true}
          refreshCompanyData={async () => {
            try {
              const updatedCompany = await handleFetchCompanyByUser();
              setCompanyData(updatedCompany);
            } catch {
              toast.error("Erro ao atualizar os dados da empresa.");
            }
          }}
        />
      )}
    </div>
  );
};

export default CompanyProfile;
