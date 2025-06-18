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
    
    const responseData = await response.json();
    
    if (!response.ok) {
      // Tratar casos específicos de bloqueio
      if (response.status === 403) {
        throw new Error(responseData.message || "Conta temporariamente bloqueada.");
      }
      throw new Error(responseData.message || "Erro ao autenticar.");
    }

    // Processar resposta de sucesso
    if (!responseData.success || !responseData.token || !responseData.user) {
      throw new Error("Resposta da API malformada ou incompleta.");
    }

    const { id, name, cpf, phone, email, addressId } = responseData.user;
    return {
      token: responseData.token,
      userId: id,
      userName: name,
      userCpf: cpf,
      userPhone: phone,
      userEmail: email,
      addressId,
      expiresIn: responseData.expiresIn,
    };
  } catch (error) {
    console.error("Erro no serviço de login:", error.message);
    throw error;
  }
};