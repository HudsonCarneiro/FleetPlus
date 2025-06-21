import API_BASE_URL from '../constants/Api';

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
      // Tratamento de bloqueio
      if (response.status === 403) {
        const error = new Error(responseData.message || "Conta temporariamente bloqueada.");
        error.name = "BlockedError"; // ← identifica tipo de erro
        error.isBlocked = true;
        error.remainingTime = responseData.remainingTime || null;
        throw error;
      }
      throw new Error(responseData.message || "Erro ao autenticar.");
    }

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
