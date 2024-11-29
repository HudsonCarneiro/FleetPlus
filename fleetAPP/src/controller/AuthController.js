import { loginUser } from "../services/AuthServices"; 

export const handleUserLogin = async (formData, navigate) => {
  try {
    const response = await loginUser(formData); 
    if (response) {
      const { token, userId } = response; 
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      navigate("/dashboard"); 
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return false; 
  }
};
