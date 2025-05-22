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
  export const handleCompanyRegistration = async(companyInput, addressInput) => {
    try {
      if (!companyInput || !addressInput) {
        throw new Error('Dados da empresa e endereço são obrigatórios.');
      }

      // Cria instância de endereço
      const address = new Address(
        addressInput.cep,
        addressInput.number,
        addressInput.road,
        addressInput.complement,
        addressInput.city,
        addressInput.state
      );

      // Salva endereço e obtém ID
      const addressId = await AddressServices.registerAddress(address);

      // Cria instância da empresa
      const company = new Company(
        companyInput.companyName,
        companyInput.businessName,
        companyInput.cnpj
      );

      // Adiciona ID do endereço ao corpo da empresa
      const companyPayload = {
        ...company,
        addressId,
      };

      // Registra empresa
      const registeredCompany = await CompanyServices.registerCompany(companyPayload);

      return { success: true, data: registeredCompany };
    } catch (error) {
      console.error('Erro ao criar empresa com endereço:', error.message);
      return { success: false, error: error.message };
    }
  };

  // Atualizar empresa e seu endereço
  export const handleCompanyUpdate = async (companyId, updatedCompanyData, addressId, updatedAddressData) => {
    try {
      if (!companyId || !addressId) {
        throw new Error('ID da empresa e do endereço são obrigatórios para atualização.');
      }

      const updatedCompany = await CompanyServices.updateCompany(companyId, updatedCompanyData);
      const updatedAddress = await AddressServices.updateAddress(addressId, updatedAddressData);

      return { success: true, data: { company: updatedCompany, address: updatedAddress } };
    } catch (error) {
      console.error('Erro ao atualizar empresa e endereço:', error.message);
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

