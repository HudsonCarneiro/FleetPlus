const User = require('../models/User');
const Address = require('../models/Address');
const sequelize = require('../config/database');
const crypto = require('crypto');

const Email = require('../validators/Email');
const Cpf = require('../validators/Cpf');
const Phone = require('../validators/Phone');

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hashedPassword };
}

async function getUsersByCompany(companyId) {
  if (!companyId) {
    throw new Error('ID da empresa não fornecido.');
  }

  const users = await User.findAll({
    where: { companyId },
    attributes: ['id', 'name', 'email', 'cpf', 'phone', 'addressId']
  });

  return users;
}

async function getUserById(id) {
  const user = await User.findByPk(id, {
    attributes: ['name', 'cpf', 'phone', 'email', 'addressId'],
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  return user;
}

async function createUser(data) {
  const t = await sequelize.transaction();
  try {
    const { name, cpf, phone, email, password, address, companyId } = data;

    // Verifica antes de tudo
    if (!name || !cpf || !phone || !email || !password || !address) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    // Validações
    try {
      new Email(email);
      const cleanedCpf = new Cpf(cpf).toString(); // limpa caracteres especiais
      new Phone(phone);
      data.cpf = cleanedCpf;
    } catch (validationError) {
      throw new Error(`Erro de validação: ${validationError.message}`);
    }

    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      throw new Error('Usuário já registrado com este email.');
    }

    // Cria o endereço
    const createdAddress = await Address.create({
      cep: address.cep,
      number: address.number,
      road: address.road,
      complement: address.complement,
      city: address.city,
      state: address.state,
    }, { transaction: t });

    const { salt, hashedPassword } = await hashPassword(password);

    // Cria o usuário, sem companyId se não for enviado
    const newUser = await User.create({
      name,
      cpf: data.cpf,
      phone,
      email,
      password: hashedPassword,
      salt,
      addressId: createdAddress.id,
      ...(companyId ? { companyId } : {}) // ← importante
    }, { transaction: t });

    await t.commit();
    return newUser;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}




async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const { password, email, cpf, phone, companyId, ...updateData } = data;

  // Validações condicionais com tratamento de erro
  try {
    if (email) new Email(email);
    if (cpf) new Cpf(cpf);
    if (phone) new Phone(phone);
  } catch (validationError) {
    throw new Error(`Erro de validação: ${validationError.message}`);
  }

  // Atualiza senha se fornecida
  if (password) {
    const { salt, hashedPassword } = await hashPassword(password);
    updateData.password = hashedPassword;
    updateData.salt = salt;
  }

  // Atualização segura com atributos opcionais
  await user.update({
    ...updateData,
    ...(email && { email }),
    ...(cpf && { cpf }),
    ...(phone && { phone }),
    ...(companyId && { companyId }),
  });

  return user;
}



async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  await user.destroy();
}

module.exports = {
  getUsersByCompany,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
