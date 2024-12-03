import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);

    const { token, userData, expiresIn, addressId } = response;

    // Salva o token, os dados do usuário e o ID do endereço no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000); // Expira em milissegundos

    // Verifica se as informações foram salvas corretamente
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("userData");
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
export const handleLogout = (navigate) => {
  try {
    // Remove os dados do usuário e o token do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("addressId");  // Remover também o ID do endereço, se armazenado

    // Redireciona para a página de login
    navigate("/login");
  } catch (error) {
    console.error("Erro ao realizar logout:", error.message);
  }
};
