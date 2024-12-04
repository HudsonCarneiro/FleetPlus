import AddressServices from "../services/AddressServices";

export const handleFetchAddressById = async (id) => {
    try {
      const address = await AddressServices.fetchAddressById(id);
      if (!address) {
        throw new Error('Endereço não encontrado.');
      }
      return address; // Retorna os dados do usuário
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null; // Retorna null em caso de erro
    }
  };
  