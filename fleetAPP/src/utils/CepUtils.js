export const fetchAddressByCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Erro ao buscar CEP');
  
      const data = await response.json();
      if (data.erro) {
        alert('CEP não encontrado!');
        return null;
      }
  
      return data;
    } catch (error) {
      console.error('Erro na busca do CEP:', error);
      alert('Não foi possível buscar o endereço. Verifique o CEP digitado.');
      return null;
    }
  };
  