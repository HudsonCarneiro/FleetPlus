import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);

    const { token, userId, userName, userCpf, userPhone, userEmail, addressId, expiresIn } = response;

    // Cria um objeto para armazenar os dados do usuário no localStorage
    const userData = {
      id: userId,
      name: userName,
      cpf: userCpf,
      phone: userPhone,
      email: userEmail,
      addressId,
    };

    // Salva os dados no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000); // Expiração em milissegundos

    // Verifica se as informações foram salvas corretamente
    const savedToken = localStorage.getItem("token");
    const savedUserData = localStorage.getItem("userData");
    const savedExpiresAt = localStorage.getItem("expiresAt");

    if (savedToken === token && savedUserData && savedExpiresAt) {
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

    // Redireciona para a página de login
    navigate("/login");
  } catch (error) {
    console.error("Erro ao realizar logout:", error.message);
  }
};
