export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Validação do status HTTP
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || "Erro ao autenticar.");
    }

    // Processar e validar a resposta JSON
    const data = await response.json();
    if (!data.success || !data.token || !data.user) {
      throw new Error("Resposta da API malformada ou incompleta.");
    }

    // Preparar os dados para uso no frontend
    const { id, name, cpf, phone , email, addressId } = data.user; // Extrair os dados necessários
    return {
      token: data.token,
      userId: id, // ID do usuário
      userName: name, // Nome do usuário
      userCpf: cpf,
      userPhone: phone,
      userEmail: email, // Email do usuário
      addressId, // ID do endereço associado
      expiresIn: data.expiresIn, // Tempo de expiração do token
    };
  } catch (error) {
    console.error("Erro no serviço de login:", error.message);
    throw error; // Repropaga o erro para ser tratado na chamada
  }
};
