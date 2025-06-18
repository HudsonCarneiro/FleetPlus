const User = require('../models/User');
const CPF = require('../validators/CPF');
const Email = require('../validators/Email');
const Phone = require('../validators/Phone');
const crypto = require('crypto');

// Função para gerar hash de senha com salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hashedPassword };
}

// Buscar usuário por ID
async function getById(id) {
  const user = await User.findByPk(id, {
    attributes: ['name', 'cpf', 'phone', 'email', 'addressId'],
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  return user;
}

// Criar novo usuário
async function createUser(data) {
  const { name, cpf, phone, email, password, addressId } = data;

  if (!name || !cpf || !phone || !email || !password || !addressId) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  try {
    data.cpf = new CPF(cpf).toString();
    data.email = new Email(email).toString();
    data.phone = new Phone(phone).toString();
  } catch (err) {
    throw new Error(`Erro de validação: ${err.message}`);
  }

  // Verifica se já existe usuário com esse email
  const exists = await User.findOne({ where: { email: data.email } });
  if (exists) {
    throw new Error('Usuário já registrado com este email.');
  }

  const { salt, hashedPassword } = hashPassword(password);

  const newUser = await User.create({
    name,
    cpf: data.cpf,
    phone: data.phone,
    email: data.email,
    password: hashedPassword,
    salt,
    addressId,
  });

  return newUser;
}

// Atualizar usuário
async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const updateFields = { ...data };

  try {
    if (data.cpf) updateFields.cpf = new CPF(data.cpf).toString();
    if (data.email) updateFields.email = new Email(data.email).toString();
    if (data.phone) updateFields.phone = new Phone(data.phone).toString();
  } catch (err) {
    throw new Error(`Erro de validação: ${err.message}`);
  }

  if (data.password) {
    const { salt, hashedPassword } = hashPassword(data.password);
    updateFields.password = hashedPassword;
    updateFields.salt = salt;
  }

  await user.update(updateFields);
  return user;
}

// Excluir usuário
async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  await user.destroy();
}

module.exports = {
  getById,
  createUser,
  updateUser,
  deleteUser,
};
