 import { loginUser } from "../services/AuthServices";

export const handleLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData);

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
    return {
      success: false,
      message: error.message,
      isBlocked: error.isBlocked || false,
      remainingTime: error.remainingTime || null, // ← importante para o contador
    };
  }
};


export const handleLogout = (navigate) => {
  try {
    // Remove todos os itens relacionados à autenticação
    ["token", "userData", "expiresAt"].forEach((key) => localStorage.removeItem(key));

    navigate("/");
  } catch (error) {
    console.error("Erro ao realizar logout:", error.message);
  }
};
