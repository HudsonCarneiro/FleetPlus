document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep-user");
    const roadInput = document.getElementById("road-user");
    const cityInput = document.getElementById("city-user");
    const stateInput = document.getElementById("state-user");
  
    const fetchAddressByCep = async (cep) => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error("Erro ao buscar CEP");
        
        const data = await response.json();
  
        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }

        roadInput.value = data.logradouro || "";
        cityInput.value = data.localidade || "";
        stateInput.value = data.uf || "";
      } catch (error) {
        console.error("Erro na busca do CEP:", error);
        alert("Não foi possível buscar o endereço. Verifique o CEP digitado.");
      }
    };
  
    cepInput.addEventListener("blur", () => {
      const cep = cepInput.value.replace(/\D/g, ""); //remover caracteres especiais 
      if (cep.length === 8) {
        fetchAddressByCep(cep);
      } else {
        alert("Digite um CEP válido com 8 números.");
      }
    });
  });
  