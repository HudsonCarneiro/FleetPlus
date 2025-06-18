const UserService = require('../services/userService');

exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    res.status(error.status || 500).json({ error: error.message });
  }
};
