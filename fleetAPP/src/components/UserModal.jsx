import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa o useNavigate
import "../styles/Modal.css";
import {
  handleUserRegistration,
  handleUserUpdate,
  handleUserDeletion,
  handleFetchUserById,
} from "../controller/UserController";

const UserModal = ({ onClose, onUpdate }) => {
  const navigate = useNavigate(); // Inicializa o navigate
  const [formData, setFormData] = useState({
    id: "", // IDs ainda estão no estado, mas não serão exibidos
    name: "",
    cpf: "",
    phone: "",
    cep: "",
    number: "",
    road: "",
    complement: "",
    city: "",
    state: "",
    email: "",
    password: "",
    addressId: "",
  });

  useEffect(() => {
    // Busca dados do usuário e endereço do localStorage
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const { id, addressId } = JSON.parse(storedUserData);

      // Define os IDs iniciais no formulário
      setFormData((prevData) => ({
        ...prevData,
        id,
        addressId,
      }));

      // Busca os dados completos do usuário pelo ID
      const fetchUserData = async () => {
        const user = await handleFetchUserById(id);
        if (user) {
          setFormData((prevData) => ({
            ...prevData,
            ...user, // Atualiza o formulário com os dados do usuário
          }));
        } else {
          console.error("Erro ao buscar os dados do usuário.");
        }
      };

      fetchUserData();
    } else {
      console.error("Nenhum dado de usuário encontrado no localStorage.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.cpf || !formData.email) {
      console.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const updatedUser = await handleUserUpdate(formData);

    if (updatedUser) {
      console.log("Usuário atualizado com sucesso");
      onClose();
      if (onUpdate) {
        onUpdate(formData); // Passa os dados atualizados
      }
    } else {
      console.error("Erro ao atualizar o usuário");
    }
  };

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );
    if (confirmDeletion) {
      const deleted = await handleUserDeletion(formData.id, formData.addressId, navigate); // Adiciona o navigate
      if (deleted) {
        console.log("Usuário excluído com sucesso");
      } else {
        console.error("Erro ao excluir o usuário");
      }
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>
        </button>
        <h3 className="text-center">Editar Usuário</h3>
        <form className="mt-4">
          <div className="row">
            {Object.keys(formData)
              .filter((key) => key !== "id" && key !== "addressId") // Filtra os campos não exibíveis
              .map((key) => (
                <div className="col-md-6 mb-3" key={key}>
                  <label className="form-label" htmlFor={key}>
                    {(() => {
                      switch (key) {
                        case "name":
                          return "Nome";
                        case "cpf":
                          return "CPF";
                        case "phone":
                          return "Telefone";
                        case "cep":
                          return "CEP";
                        case "number":
                          return "Número";
                        case "road":
                          return "Rua";
                        case "complement":
                          return "Complemento";
                        case "city":
                          return "Cidade";
                        case "state":
                          return "Estado";
                        case "email":
                          return "E-mail";
                        case "password":
                          return "Senha";
                        default:
                          return key;
                      }
                    })()}
                  </label>
                  <input
                    type={key === "password" ? "password" : "text"}
                    id={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly={["cpf", "email"].includes(key)} // Campos não editáveis
                  />
                </div>
              ))}
          </div>
        </form>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-danger" onClick={handleDelete}>
            Excluir
          </button>
          <button className="btn btn-primary" onClick={handleUpdate}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
