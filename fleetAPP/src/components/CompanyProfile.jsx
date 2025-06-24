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

  const fetchCompany = async () => {
    try {
      const result = await handleFetchCompanyByUser();
      if (result.success && result.data) {
        setCompanyData(result.data);
      } else {
        setCompanyData(null);
        if (result.error) toast.error(result.error);
      }
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      toast.error("Erro ao buscar dados da empresa.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleEditClick = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta empresa? Essa ação não pode ser desfeita."
    );
    if (!confirmDelete || !companyData?.id) return;

    try {
      const addressId = companyData?.address?.id || null;
      const result = await handleCompanyDeletion(companyData.id, addressId);

      if (result.success) {
        toast.success(result.message);
        setCompanyData(null);
      } else {
        toast.error(result.error || "Erro ao excluir empresa.");
      }
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
      toast.error("Erro inesperado ao excluir empresa.");
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
                {[
                  { label: "Nome Fantasia", value: companyData.businessName },
                  { label: "Razão Social", value: companyData.companyName },
                  { label: "CNPJ", value: companyData.cnpj },
                  { label: "CEP", value: companyData.address?.cep },
                  { label: "Rua", value: companyData.address?.road },
                  { label: "Número", value: companyData.address?.number },
                  { label: "Complemento", value: companyData.address?.complement },
                  { label: "Cidade", value: companyData.address?.city },
                  { label: "Estado", value: companyData.address?.state },
                  { label: "Bairro", value: companyData.address?.district },
                ].map((field, idx) => (
                  <div
                    className={`col-md-${field.label === "Complemento" || field.label === "Número" ? "3" : "6"} mb-3`}
                    key={idx}
                  >
                    <label className="form-label">{field.label}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={field.value || ""}
                      readOnly
                    />
                  </div>
                ))}
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
          refreshCompanyData={fetchCompany}
        />
      )}
    </div>
  );
};

export default CompanyProfile;
