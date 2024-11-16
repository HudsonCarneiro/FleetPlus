export async function registerUser(user, addressId) {
    try {
        user.addressId = addressId; // Atribui o ID do endereço ao usuário
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            // Captura o corpo da resposta para exibir o erro
            const errorData = await response.json();
            throw new Error(`Erro ao criar o usuário: ${errorData.error || response.statusText}`);
        }

        const data = await response.json(); // Aguarda os dados do backend
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return data.user; // Retorna os dados do usuário criado

    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error; // Propaga o erro para tratamento adicional
    }
}


