export async function validateUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Supondo que o backend retorne um JSON com `success`, `token` e `message`
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Erro ao fazer login' };
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        throw new Error('Erro de rede ou no servidor.');
    }
}
