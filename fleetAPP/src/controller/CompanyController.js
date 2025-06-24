import CompanyServices from '../services/companyServices';
import AddressServices from '../services/addressService';

// Buscar empresa vinculada ao usuário autenticado
export const handleFetchCompanyByUser = async () => {
  try {
    const company = await CompanyServices.fetchCompanyByUser();
    return { success: true, data: company };
  } catch (error) {
    console.error('Erro ao buscar empresa:', error.message);
    return { success: false, error: error.message };
  }
};

// Criar nova empresa (com endereço embutido)
export const handleCompanyRegistration = async (formData) => {
  try {
    const payload = {
      companyName: formData.companyName,
      businessName: formData.businessName,
      cnpj: formData.cnpj,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
        district: formData.district || '',
      },
    };

    const createdCompany = await CompanyServices.registerCompany(payload);
    return { success: true, data: createdCompany };
  } catch (error) {
    console.error('Erro ao criar empresa:', error.message);
    return { success: false, error: error.message };
  }
};

// Atualizar empresa do usuário logado (inclui atualização de endereço)
export const handleCompanyUpdate = async (formData) => {
  try {
    const updatedCompany = {
      companyName: formData.companyName,
      businessName: formData.businessName,
      cnpj: formData.cnpj,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
        district: formData.district || '',
      },
    };

    const response = await CompanyServices.updateCompany(updatedCompany);
    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error.message);
    return { success: false, error: error.message };
  }
};

// Excluir empresa do usuário logado e opcionalmente o endereço
export const handleCompanyDeletion = async (addressId = null) => {
  try {
    await CompanyServices.deleteCompany();

    if (addressId) {
      await AddressServices.deleteAddress(addressId);
    }

    return {
      success: true,
      message: 'Empresa (e endereço, se fornecido) excluídos com sucesso.',
    };
  } catch (error) {
    console.error('Erro ao excluir empresa e/ou endereço:', error.message);
    return { success: false, error: error.message };
  }
};
