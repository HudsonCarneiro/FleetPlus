import Company from '../model/Company';
import Address from '../model/Address';
import CompanyServices from '../services/companyServices';
import AddressServices from '../services/AddressServices';


  // Buscar empresa vinculada ao usuário logado
  export const handleFetchCompanyByUser = async (id) => {
    try {
      const company = await CompanyServices.fetchCompanyByUser();
      return { success: true, data: company };
    } catch (error) {
      console.error('Erro ao buscar empresa:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Criar uma nova empresa com endereço
 export const handleCompanyRegistration = async (formData) => {
  try {
      const payload = {
      cnpj: formData.cnpj,
      companyName: formData.companyName,
      businessName: formData.businessName,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
      }
    };

    const response = await CompanyServices.registerCompany(payload);
    return response;
  } catch (error) {
    console.error('Erro ao criar empresa:', error.message);
    return { success: false, error: error.message };
  }
};


  // Atualizar empresa e seu endereço
 export const handleCompanyUpdate = async (companyId, formData) => {
  try {
    const updatedCompanyData = {
      businessName: formData.businessName,
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      address: {
        cep: formData.cep,
        number: formData.number,
        road: formData.road,
        complement: formData.complement,
        city: formData.city,
        state: formData.state,
        district: formData.district || "",
      }
    };

    const response = await CompanyServices.updateCompany(companyId, updatedCompanyData);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error.message);
    return { success: false, error: error.message };
  }
};

  // Excluir empresa e opcionalmente o endereço
  export const handleCompanyDeletion = async (companyId, addressId = null)=> {
    try {
      if (!companyId) throw new Error('ID da empresa é obrigatório.');

      await CompanyServices.deleteCompany(companyId);

      if (addressId) {
        await AddressServices.deleteAddress(addressId);
      }

      return { success: true, message: 'Empresa (e endereço, se fornecido) excluídos com sucesso.' };
    } catch (error) {
      console.error('Erro ao excluir empresa e/ou endereço:', error.message);
      return { success: false, error: error.message };
    }
  };

