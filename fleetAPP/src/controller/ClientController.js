import Address from '../model/Address';
import Client from '../model/Client';
import ClientServices from '../services/ClientServices';
import AddressServices from '../services/AddressServices';

// Buscar cliente por ID e endereço associado
export const handleFetchClientById = async (id) => {
  try {
    const client = await ClientServices.fetchClientById(id);
    if (!client) {
      throw new Error('Cliente não encontrado.');
    }

    // Buscar o endereço associado ao cliente
    const address = await AddressServices.fetchAddressById(client.addressId);
    if (!address) {
      throw new Error('Endereço não encontrado.');
    }

    // Retornar dados consolidados
    return {
      businessName: client.businessName,
      companyName: client.companyName,
      cnpj: client.cnpj,
      phone: client.phone,
      email: client.email,
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    };
  } catch (error) {
    console.error('Erro ao buscar cliente e endereço:', error.message);
    return null; // Retorna null em caso de erro
  }
};

// Registrar um novo cliente e endereço
export const handleClientRegistration = async (formData) => {
  try {
    // Criação do endereço
    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state,
    );

    const addressResponse = await AddressServices.registerAddress(address);
    if (!addressResponse) {
      throw new Error('Erro ao registrar endereço.');
    }

    // Criação do cliente
    const client = new Client(
      formData.businessName,
      formData.companyName,
      formData.cnpj,
      formData.phone,
      formData.email,
    );

    const clientResponse = await ClientServices.registerClient(client, addressResponse);
    if (clientResponse) {
      console.log('Cliente cadastrado com sucesso:', clientResponse);
      return true;
    } else {
      throw new Error('Erro ao registrar cliente.');
    }
  } catch (error) {
    console.error('Erro no registro do cliente:', error.message);
    return false; // Retorna false em caso de erro
  }
};

// Atualizar cliente e endereço
export const handleClientUpdate = async (formData) => {
  try {
    // Validação básica
    if (!formData.id || !formData.addressId) {
      throw new Error('ID do cliente ou do endereço não fornecido.');
    }

    // Atualizar o endereço
    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state,
    );

    const addressResponse = await AddressServices.updateAddress(formData.addressId, address);
    if (!addressResponse) {
      throw new Error('Erro ao atualizar endereço.');
    }

    console.log('Endereço atualizado com sucesso:', addressResponse);

    // Atualizar o cliente
    const client = new Client(
      formData.businessName,
      formData.companyName,
      formData.cnpj,
      formData.phone,
      formData.email,
    );

    const clientResponse = await ClientServices.updateClient(formData.id, client);
    if (clientResponse) {
      console.log('Cliente atualizado com sucesso:', clientResponse);
      return true; // Retorna true para sucesso
    } else {
      throw new Error('Erro ao atualizar cliente.');
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente e endereço:', error.message);
    return false; // Retorna false em caso de erro
  }
};

// Excluir cliente e endereço associados
export const handleClientDeletion = async (clientId, addressId) => {
  try {
    if (!clientId) {
      throw new Error('ID do cliente não fornecido.');
    }

    // Excluir o cliente
    await ClientServices.deleteClient(clientId);
    console.log('Cliente excluído com sucesso.');

    // Excluir o endereço associado, se informado
    if (addressId) {
      await AddressServices.deleteAddress(addressId);
      console.log('Endereço excluído com sucesso.');
    }

    return true; // Retorna true para sucesso
  } catch (error) {
    console.error('Erro ao excluir cliente e endereço:', error.message);
    return false; // Retorna false em caso de erro
  }
};
