export async function registerUser(user, addressId) {
    try {
        user.addressId = addressId; // Atribui o ID do endereço ao usuário
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar o usuário. Status: ${response.status}`);
        }

        const data = await response.json(); // Aguarda a resposta do backend
        return data; // Retorna os dados do usuário criado
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        throw error;
    }
}

// Função para redirecionar para o dashboard
export function dashboardOpen() {
    try {
        window.location.href = '../pages/dashboard.html'; // Certifique-se que o caminho está correto
    } catch (error) {
        console.error("Falha ao acessar o dashboard:", error);
    }
}


