export async function registerAddress(address) {
    try{
        const response = await fetch('http://localhost:3000/api/address', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(address) 
        });
        if (!response.ok) {
            throw new Error('Erro ao registrar o endereço. Status: ' + response.status);
        }
        const data = await response.json();
        if (!data.id) { 
            throw new Error('Erro ao criar o endereço, ID ausente.');
        }
        return data.id; 
    } catch (error) {
        console.error('Erro ao criar o endereço:', error);
        throw error; 
    }
}

