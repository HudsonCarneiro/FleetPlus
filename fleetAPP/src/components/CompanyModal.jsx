import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import { toast } from "react-toastify";
import {
  handleCompanyRegistration,
  handleCompanyUpdate,
  handleFetchCompanyByUser,
} from "../controller/CompanyController";

const initialFormState = {
  businessName: "",
  companyName: "",
  cnpj: "",
  cep: "",
  number: "",
  road: "",
  complement: "",
  city: "",
  state: "",
};

const requiredFields = [
  "businessName",
  "companyName",
  "cnpj",
  "cep",
  "road",
  "city",
  "state",
];

const CompanyModal = ({ show, onClose, isEditMode, refreshCompanyData }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const company = await handleFetchCompanyByUser();
          setCompanyId(company.id || null);
          setFormData({
            businessName: company.businessName || "",
            companyName: company.companyName || "",
            cnpj: company.cnpj || "",
            cep: company.address?.cep || "",
            number: company.address?.number || "",
            road: company.address?.road || "",
            complement: company.address?.complement || "",
            city: company.address?.city || "",
            state: company.address?.state || "",
          });
        } catch (error) {
          toast.error("Erro ao carregar dados da empresa.");
        } finally {
          setLoading(false);
        }
      } else {
        setFormData(initialFormState);
        setCompanyId(null);
      }
    };

    if (show) initializeForm();
  }, [show, isEditMode]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validateFields = () => {
    const invalidFields = requiredFields.filter((field) => !formData[field]);
    if (invalidFields.length > 0) {
      toast.error(
        `Os seguintes campos são obrigatórios: ${invalidFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      if (isEditMode && companyId) {
        await handleCompanyUpdate(companyId, formData);
        toast.success("Empresa atualizada com sucesso!");
      } else {
        await handleCompanyRegistration(formData);
        toast.success("Empresa cadastrada com sucesso!");
      }

      onClose();
      refreshCompanyData?.();
    } catch (error) {
      toast.error("Erro ao salvar empresa. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="btn-close" onClick={onClose}></button>
          <h3 className="text-center">
            {isEditMode ? "Editar Empresa" : "Cadastrar Empresa"}
          </h3>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : (
            <form className="mt-4">
              <div className="row">
                {Object.keys(initialFormState).map((key) => (
                  <div className="col-md-6 mb-3" key={key}>
                    <label className="form-label" htmlFor={key}>
                      {{
                        businessName: "Nome Fantasia",
                        companyName: "Razão Social",
                        cnpj: "CNPJ",
                        cep: "CEP",
                        number: "Número",
                        road: "Rua",
                        complement: "Complemento",
                        city: "Cidade",
                        state: "Estado",
                      }[key] || key}
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </form>
          )}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleSave}
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : isEditMode
                ? "Salvar Alterações"
                : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CompanyModal;
