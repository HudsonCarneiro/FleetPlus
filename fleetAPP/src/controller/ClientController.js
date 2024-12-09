import { 
  fetchClientById, 
  fetchClients, 
  updateClient, 
  deleteClient, 
  registerClient
} from '../services/ClientServices';


// Buscar todos os clientes com seus endereços
export const handleFetchAllClients = async () => {
  try {
    const clients = await fetchClients();

    if (!clients || clients.length === 0) {
      console.warn("Nenhum cliente encontrado.");
      return [];
    }

    return clients.map(client => ({
      ...client,
      address: client.Address || {}, // Inclui o endereço diretamente do backend
    }));
  } catch (error) {
    console.error("Erro ao buscar todos os clientes:", error.message);
    throw error;
  }
};

export const handleFetchClientById = async (clientId) => {
  try {
    if (!clientId) {
      throw new Error("ID do cliente não fornecido.");
    }

    // Chamada ao serviço para buscar os dados do cliente pelo ID
    const clientData = await fetchClientById(clientId);

    if (!clientData) {
      throw new Error("Cliente não encontrado.");
    }

    return clientData; // Retorna os dados do cliente
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    throw error; // Repassa o erro para ser tratado no componente ou no chamador
  }
};


// Registrar cliente e endereço juntos
export const handleClientRegistration = async (formData) => {
  try {
    const clientPayload = {
      businessName: formData.businessName,
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      phone: formData.phone,
      email: formData.email,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
      },
    };

    const response = await registerClient(clientPayload);
    console.log('Cliente registrado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    throw error;
  }
};

// Atualizar cliente e endereço juntos
export const handleClientUpdate = async (formData) => {
  try {
    const updatedClient = {
      businessName: formData.businessName,
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      phone: formData.phone,
      email: formData.email,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
      },
    };

    const response = await updateClient(formData.id, updatedClient);
    console.log('Cliente atualizado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw error;
  }
};

// Excluir cliente
export const handleClientDeletion = async (id) => {
  try {
    const success = await deleteClient(id);
    console.log('Cliente excluído com sucesso.');
    return success;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    throw error;
  }
};
