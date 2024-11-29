import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);
    if (response && response.token && response.userId) {
      const { token, userId } = response;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      if (localStorage.getItem("token") === token && localStorage.getItem("userId") === userId) {
        navigate("/dashboard"); // Redireciona apenas após confirmação
        return true;
      } else {
        throw new Error("Falha ao salvar informações de autenticação.");
      }

    } else {
      console.error("Resposta inválida do servidor:", response);
      return false;
    }
  } catch (error) {
    console.error("Erro no login:", error.message);
    return false;
  }
};

