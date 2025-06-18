import API_BASE_URL from '../constants/api';

export async function protectDashboard(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido ou expirado.');
        }

        const data = await response.json();
        console.log('Token válido. Acesso permitido.', data);
        return data;
    } catch (error) {
        console.error('Erro ao validar token:', error.message);
        localStorage.removeItem('token');
        throw error;
    }
}


