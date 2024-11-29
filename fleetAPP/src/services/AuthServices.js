export const loginUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Retorna os dados em caso de sucesso
    } else {
      alert("Erro ao autenticar. Verifique suas credenciais.");
      return null; // Retorna null em caso de erro
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao realizar login. Tente novamente mais tarde.");
    return null; // Retorna null em caso de erro
  }
};
