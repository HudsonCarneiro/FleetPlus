import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);

    const { token, user, expiresIn } = response;

    // Salva o token e os dados do usuário no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000); // Expira em milissegundos

    // Verifica se as informações foram salvas corretamente
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedExpiresAt = localStorage.getItem("expiresAt");

    if (savedToken === token && savedUser && savedExpiresAt) {
      navigate("/dashboard"); // Redireciona após sucesso
      return true;
    } else {
      throw new Error("Falha ao salvar informações de autenticação.");
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error.message);
    return false;
  }
};
