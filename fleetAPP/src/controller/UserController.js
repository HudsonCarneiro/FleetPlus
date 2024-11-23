import { fetchAddressByCep } from '../utils/CepUtils';
import { registerUser } from '../services/UserServices';
import { registerAddress } from '../services/AddressServices';

export const handleUserRegistration = async (formData) => {
  try {
    // Busca endereço pelo CEP
    if (formData.cep.length === 8) {
      const address = await fetchAddressByCep(formData.cep);
      if (address) {
        formData.road = address.logradouro || '';
        formData.city = address.localidade || '';
        formData.state = address.uf || '';
      } else {
        throw new Error('CEP inválido.');
      }
    }

    // Registra o endereço
    const addressId = await registerAddress({
      cep: formData.cep,
      number: formData.number,
      road: formData.road,
      complement: formData.complement,
      city: formData.city,
      state: formData.state,
    });

    // Registra o usuário com o ID do endereço
    const newUser = await registerUser({
      name: formData.name,
      cpf: formData.cpf,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      addressId,
    });

    console.log('Usuário registrado com sucesso:', newUser);
    return true; // Indica sucesso
  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    throw error; // Propaga o erro
  }
};
