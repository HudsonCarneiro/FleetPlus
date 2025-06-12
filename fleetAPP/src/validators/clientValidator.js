export const validateClientData = (clientData) => {
    const {
      businessName,
      companyName,
      cnpj,
      phone,
      email,
      cep,
      road,
      number,
      city,
      state,
    } = clientData;
  
    if (!businessName || typeof businessName !== 'string') {
      throw new Error('O nome comercial é obrigatório e deve ser uma string.');
    }
    if (!companyName || typeof companyName !== 'string') {
      throw new Error('O nome da empresa é obrigatório e deve ser uma string.');
    }
    if (!cnpj || typeof cnpj !== 'string' || cnpj.length !== 14) {
      throw new Error('O CNPJ é obrigatório e deve conter 14 caracteres.');
    }
    if (!phone || typeof phone !== 'string') {
      throw new Error('O telefone é obrigatório e deve ser uma string.');
    }
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw new Error('O email é inválido.');
    }
    if (cep && (typeof cep !== 'string' || cep.length !== 8)) {
      throw new Error('O CEP deve conter 8 caracteres.');
    }
    if (road && typeof road !== 'string') {
      throw new Error('A rua deve ser uma string.');
    }
    if (number && (typeof number !== 'string' && typeof number !== 'number')) {
      throw new Error('O número deve ser uma string ou número.');
    }
    if (city && typeof city !== 'string') {
      throw new Error('A cidade deve ser uma string.');
    }
    if (state && typeof state !== 'string') {
      throw new Error('O estado deve ser uma string.');
    }
  
    return true;
  };