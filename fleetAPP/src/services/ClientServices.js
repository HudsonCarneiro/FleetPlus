// Defina a URL base da API
const BASE_URL = 'http://localhost:3000/api';

// Função utilitária para verificar resposta da API
async function handleResponse(response) {
  try {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || response.statusText);
    }
    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Erro ao processar a resposta da API.');
    }
    throw error;
  }
}

// Função para registrar um cliente
export async function registerClient(client, addressId) {
  if (!client || !addressId) {
    throw new Error('Cliente ou ID do endereço não informado.');
  }

  try {
    client.addressId = addressId;

    const response = await fetch(`${BASE_URL}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao registrar o cliente:', error.message || error);
    throw error;
  }
}

// Função para buscar cliente por ID
export async function fetchClientById(id) {
  if (!id) {
    throw new Error('ID do cliente não informado.');
  }

  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message || error);
    throw error;
  }
}

// Função para buscar todos os clientes
export async function fetchClients() {
  try {
    const response = await fetch(`${BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message || error);
    throw error;
  }
}

// Função para atualizar um cliente
export async function updateClient(id, updatedClient) {
  if (!id || !updatedClient) {
    throw new Error('ID do cliente ou dados de atualização não informados.');
  }

  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClient),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error.message || error);
    throw error;
  }
}

// Função para deletar um cliente
export async function deleteClient(id) {
  if (!id) {
    throw new Error('ID do cliente não informado.');
  }

  try {
    const response = await fetch(`${BASE_URL}/client/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erro ao excluir cliente: ${errorData.message || response.statusText}`
      );
    }

    return { message: 'Cliente excluído com sucesso' };
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message || error);
    throw error;
  }
}

// Exportando todas as funções juntas
export default {
  registerClient,
  fetchClientById,
  fetchClients,
  updateClient,
  deleteClient,
};
