// src/services/addressService.js
import API_BASE_URL from '../constants/api';

export async function fetchAddressById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar endereço. Status: ' + response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    throw error;
  }
}

export async function registerAddress(address) {
  try {
    const response = await fetch(`${API_BASE_URL}/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error('Erro ao registrar o endereço. Status: ' + response.status);
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error('Erro ao criar o endereço, ID ausente.');
    }

    return data.id;
  } catch (error) {
    console.error('Erro ao criar o endereço:', error);
    throw error;
  }
}

export async function updateAddress(id, updatedAddress) {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAddress),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar o endereço. Status: ' + response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar o endereço:', error);
    throw error;
  }
}

export async function deleteAddress(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erro ao excluir o endereço: ${errorData.message || response.statusText}`
      );
    }

    return { message: 'Endereço excluído com sucesso' };
  } catch (error) {
    console.error('Erro ao excluir endereço:', error.message || error);
    throw error;
  }
}

export default {
  registerAddress,
  fetchAddressById,
  updateAddress,
  deleteAddress,
};
