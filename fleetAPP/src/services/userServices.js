/**
 * Registra um novo usuário no sistema, associando-o a um endereço existente.
 *
 * @param {Object} user - Objeto contendo os dados do usuário.
 * @param {number} addressId - ID do endereço previamente registrado.
 * @returns {Promise<Object>} - Os dados do usuário criado retornados pelo backend.
 * @throws {Error} - Lança um erro caso a requisição falhe.
 */
export async function registerUser(user, addressId) {
    try {
      // Atribui o ID do endereço ao usuário
      user.addressId = addressId;
  
      // Faz a requisição ao backend
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user), // Converte o objeto para JSON
      });
  
      if (!response.ok) {
        // Captura detalhes do erro retornado pelo backend
        const errorData = await response.json();
        throw new Error(
          `Erro ao criar o usuário: ${errorData.error || response.statusText}`
        );
      }
  
      // Retorna os dados do usuário criado
      const data = await response.json();
      return data;
    } catch (error) {
      // Exibe e propaga o erro
      console.error('Erro ao registrar o usuário:', error);
      throw error;
    }
  }
  