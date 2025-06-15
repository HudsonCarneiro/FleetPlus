// src/services/authService.js
import API_BASE_URL from '../constants/api';

export const loginUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || 'Erro ao autenticar.');
    }

    const data = await response.json();
    if (!data.success || !data.token || !data.user) {
      throw new Error('Resposta da API malformada ou incompleta.');
    }

    const { id, name, cpf, phone, email, addressId } = data.user;
    return {
      token: data.token,
      userId: id,
      userName: name,
      userCpf: cpf,
      userPhone: phone,
      userEmail: email,
      addressId,
      expiresIn: data.expiresIn,
    };
  } catch (error) {
    console.error('Erro no serviço de login:', error.message);
    throw error;
  }
};
