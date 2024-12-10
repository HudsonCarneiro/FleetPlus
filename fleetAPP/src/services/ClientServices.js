
// URL base da API
const API_URL = 'http://localhost:3000/api';

// Obtém o ID do usuário logado do localStorage
const getUserIdFromSession = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).id : null;
};

// Função para buscar todos os clientes do usuário logado
export const fetchClients = async () => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const url = new URL(`${API_URL}/clients`);
    url.searchParams.append('userId', userId);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(
        `Erro ao buscar clientes: ${response.status} - ${
          errorDetails.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Formato de resposta inválido. Esperado uma lista de clientes.');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw error;
  }
};

// Função para buscar um cliente pelo ID
export const fetchClientById = async (id) => {
  try {
    const userId = getUserIdFromSession(); // Obtemos o ID do usuário autenticado
    if (!userId) throw new Error("Usuário não autenticado.");

    console.log("Buscando cliente com ID:", id);

    // Faz a chamada para o endpoint do backend
    const response = await fetch(`${API_URL}/client/${id}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
    }

    // Obtém os dados do cliente retornados pela API
    const clientData = await response.json();

    // Certifica-se de que os dados do endereço estão presentes
    const formattedData = {
      id: clientData.id || "",
      businessName: clientData.businessName || "",
      companyName: clientData.companyName || "",
      cnpj: clientData.cnpj || "",
      phone: clientData.phone || "Não informado",
      email: clientData.email || "",
      address: {
        id: clientData.addressId || "",
        cep: clientData.cep || "CEP não informado",
        road: clientData.road || "Logradouro não informado",
        number: clientData.number || "Número não informado",
        complement: clientData.complement || "",
        city: clientData.city || "Cidade não informada",
        state: clientData.state || "Estado não informado",
      },
    };

    return formattedData;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message);
    throw error;
  }
};


// Função para registrar um cliente com endereço
export const registerClient = async (client) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    client.userId = userId;

    const response = await fetch(`${API_URL}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      throw new Error(`Erro ao registrar cliente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar cliente:', error.message);
    throw error;
  }
};



// Função para atualizar um cliente e endereço
export const updateClient = async (id, updatedClient) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/client/${id}userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedClient, userId }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar cliente: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw error;
  }
};

// Função para excluir um cliente
export const deleteClient = async (id) => {
  try {
    const userId = getUserIdFromSession();
    if (!userId) throw new Error('Usuário não autenticado.');

    const response = await fetch(`${API_URL}/client/${id}?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir cliente: ${response.statusText}`);
    }
    return response.status === 204;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
    throw error;
  }
};

// Exporta todas as funções juntas
export default {
  registerClient,
  fetchClients,
  fetchClientById,
  updateClient,
  deleteClient,
};
