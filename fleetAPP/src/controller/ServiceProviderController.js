import ServiceProvider from '../model/ServiceProvider.js';
import {
  fetchServiceProviders,
  fetchServiceProviderById,
  registerServiceProvider,
  updateServiceProvider,
  deleteServiceProvider
} from '../services/ServiceProviderServices.js';

export const handleFetchAllServiceProviders = async () => {
  try {
    const serviceProviders = await fetchServiceProviders();

    if (!serviceProviders || serviceProviders.length === 0) {
      console.warn('Nenhum prestador de serviço encontrado.');
      return [];
    }

    return serviceProviders;
  } catch (error) {
    console.error('Erro ao buscar prestadores de serviço:', error.message);
    return [];
  }
};

export const handleFetchServiceProviderById = async (id) => {
  try {
    const provider = await fetchServiceProviderById(id);

    if (!provider) {
      throw new Error('Prestador de serviço não encontrado.');
    }

    return provider;
  } catch (error) {
    console.error('Erro ao buscar prestador de serviço por ID:', error.message);
    return null;
  }
};

export const handleServiceProviderRegistration = async (formData) => {
  try {
    const { businessName, companyName, cnpj, phone } = formData;

    if (!businessName || !companyName || !cnpj || !phone) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    const newProvider = new ServiceProvider(businessName, companyName, cnpj, phone);
    const created = await registerServiceProvider({
      businessName: newProvider.businessName,
      companyName: newProvider.companyName,
      cnpj: newProvider.cnpj,
      phone: newProvider.phone
    });

    console.log('Prestador de serviço cadastrado com sucesso:', created);
    return created;

  } catch (error) {
    console.error('Erro no registro do prestador de serviço:', error.message);
    return null;
  }
};

export const handleServiceProviderUpdate = async (formData) => {
  try {
    const { id, businessName, companyName, cnpj, phone } = formData;

    if (!id || !businessName || !companyName || !cnpj || !phone) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos para atualização.');
    }

    const updatedProvider = new ServiceProvider(businessName, companyName, cnpj, phone);
    const updated = await updateServiceProvider(id, {
      businessName: updatedProvider.businessName,
      companyName: updatedProvider.companyName,
      cnpj: updatedProvider.cnpj,
      phone: updatedProvider.phone
    });

    console.log('Prestador de serviço atualizado com sucesso:', updated);
    return updated;

  } catch (error) {
    console.error('Erro ao atualizar prestador de serviço:', error.message);
    return null;
  }
};

export const handleServiceProviderDeletion = async (id) => {
  try {
    if (!id) {
      throw new Error('ID do prestador de serviço não fornecido.');
    }

    await deleteServiceProvider(id);

    console.log('Prestador de serviço excluído com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao excluir prestador de serviço:', error.message);
    return false;
  }
};
