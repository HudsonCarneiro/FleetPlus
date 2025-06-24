import apiRequest from '../utils/ApiRequest';

// Buscar empresa vinculada ao usuário autenticado
export const fetchCompanyByUser = async () => {
  try {
    return await apiRequest('/company/user', 'GET');
  } catch (error) {
    console.error('Erro ao buscar empresa do usuário:', error.message);
    throw error;
  }
};

// Criar nova empresa vinculada ao usuário logado
export const registerCompany = async (companyData) => {
  try {
    if (!companyData || typeof companyData !== 'object') {
      throw new Error('Dados inválidos para criação da empresa.');
    }
    return await apiRequest('/company', 'POST', companyData);
  } catch (error) {
    console.error('Erro ao criar empresa:', error.message);
    throw error;
  }
};

// Atualizar empresa vinculada ao usuário logado
export const updateCompany = async (companyData) => {
  try {
    if (!companyData || typeof companyData !== 'object') {
      throw new Error('Dados inválidos para atualização da empresa.');
    }
    return await apiRequest('/company', 'PUT', companyData);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error.message);
    throw error;
  }
};

// Excluir empresa vinculada ao usuário logado
export const deleteCompany = async () => {
  try {
    return await apiRequest('/company', 'DELETE');
  } catch (error) {
    console.error('Erro ao excluir empresa:', error.message);
    throw error;
  }
};

// Exportação agrupada
export default {
  fetchCompanyByUser,
  registerCompany,
  updateCompany,
  deleteCompany,
};
