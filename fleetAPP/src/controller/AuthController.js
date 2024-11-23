import React, { useState } from 'react';
import { validateUser } from '../services/AuthServices.js';
import { protectDashboard } from '../services/DashboardServices.js';

export const handleUserRegistration = async (formData) => {
    try {
        const email = formData.email;
        const password = formData.password;

        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const response = await validateUser(email, password);

        if (!response.success) {
            return alert(response.message || 'Login falhou. Verifique suas credenciais.');
        }

        localStorage.setItem('authToken', response.token);

        const userData = await protectDashboard(response.token); // Aguarda validação do token
        openDashboard(userData); // Redireciona ao dashboard com os dados do usuário

    } catch {
        console.error('Erro durante o login:', error.message);
        alert('Erro ao validar login ou token. Tente novamente.');
    }
}

