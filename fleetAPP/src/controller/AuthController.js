import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);

    console.log("Login response:", response);

    const {
      token,
      userId = null,
      userName = "",
      userCpf = "",
      userPhone = "",
      userEmail = "",
      addressId = null,
      expiresIn = 0,
    } = response || {};

    if (!token || !userId) {
      throw new Error("Dados inválidos retornados pelo servidor.");
    }

    const userData = {
      id: userId,
      name: userName,
      cpf: userCpf,
      phone: userPhone,
      email: userEmail,
      addressId,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000);

    navigate("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao realizar login:", error.message);
    return { 
      success: false, 
      message: error.message,
      isBlocked: error.message.includes("bloqueada") // Flag para identificar bloqueio
    };
  }
};

export const handleLogout = (navigate) => {
  try {
    // Remove os dados do usuário e o token do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("expiresAt");

    // Redireciona para a página de login
    navigate("/");
  } catch (error) {
    console.error("Erro ao realizar logout:", error.message);
  }
};
