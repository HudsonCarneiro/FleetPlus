export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || "Erro ao autenticar.");
    }

    const data = await response.json();

    if (data && data.token && data.userId) {
      return data;
    } else {
      throw new Error("Resposta inesperada do servidor.");
    }
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error; // Repropaga o erro para o controller lidar
  }
};
