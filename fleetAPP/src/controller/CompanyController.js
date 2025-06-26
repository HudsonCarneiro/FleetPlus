import CompanyServices from '../services/companyServices';
import AddressServices from '../services/addressService';
import Cnpj from '../validators/Cnpj';
import { fetchAddressByCep } from '../utils/CepUtils';

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

// Criar nova empresa (com validação e endereço embutido)
export const handleCompanyRegistration = async (formData) => {
  try {
    const cnpj = new Cnpj(formData.cnpj);

    // Preencher endereço via CEP (caso queira garantir consistência)
    if (!formData.road || !formData.city || !formData.state) {
      const address = await fetchAddressByCep(formData.cep);
      if (!address || address.erro) {
        throw new Error('CEP inválido ou não encontrado.');
      }

      formData.road = address.logradouro || '';
      formData.city = address.localidade || '';
      formData.state = address.uf || '';
    }

    const payload = {
      companyName: formData.companyName,
      businessName: formData.businessName,
      cnpj: cnpj.toString(),
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

// Atualizar empresa do usuário logado (com validação e preenchimento por CEP)
export const handleCompanyUpdate = async (formData) => {
  try {
    const cnpj = new Cnpj(formData.cnpj);

    // Preencher endereço via CEP se não estiver completo
    if (!formData.road || !formData.city || !formData.state) {
      const address = await fetchAddressByCep(formData.cep);
      if (!address || address.erro) {
        throw new Error('CEP inválido ou não encontrado.');
      }

      formData.road = address.logradouro || '';
      formData.city = address.localidade || '';
      formData.state = address.uf || '';
    }

    const updatedCompany = {
      companyName: formData.companyName,
      businessName: formData.businessName,
      cnpj: cnpj.toString(),
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

// Excluir empresa do usuário logado (e endereço, se necessário)
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
