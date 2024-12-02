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

    // Validação da resposta JSON
    const data = await response.json();
    if (!data.success || !data.token || !data.userId) {
      throw new Error("Resposta da API malformada ou incompleta.");
    }

    return data;
  } catch (error) {
    console.error("Erro no serviço de login:", error.message);
    throw error; // Repropaga o erro para ser tratado na chamada
  }
};

