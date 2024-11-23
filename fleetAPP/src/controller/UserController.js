import React, { useState } from 'react';
import Address from '../model/Address';
import User from '../model/User';
import { registerAddress } from '../services/AddressServices';
import { registerUser } from '../services/UserServices';

export const handleUserRegistration = async (formData) => {
  try {
    // Extrai os dados de endereço
    const address = new Address(
      formData.cep,
      formData.number,
      formData.road,
      formData.complement,
      formData.city,
      formData.state,
    )   

    const addressResponse = await registerAddress(address);

    if (!addressResponse) {
      throw new Error('Erro ao registrar endereço.');
    }

    const user = new User (
      formData.name,
      formData.cpf,
      formData.phone,
      formData.email,
      formData.password,
    )
    if(user){
      console.log('Objeto User Criado');
    }
      
    const userResponse = await registerUser(user, addressResponse);
    if (userResponse) {
      console.log('Usuário cadastrado com sucesso'); 
      return window.location.href = '../pages/formLogin.html';
    } else {
      throw new Error('Erro ao registrar usuário.');
    }
    } catch (error) {
      console.error('Erro no registro do usuário:', error);
      return false; 
    }
};

