const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Company = require('../models/Company');

const EXPIRATION_HOURS = 24;

// Criar novo convite
exports.createInvitation = async (req, res) => {
  try {
    const { email, companyId } = req.body;

    if (!email || !companyId) {
      return res.status(400).json({ message: 'Email e ID da empresa são obrigatórios.' });
    }

    // Gera token único
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      email,
      token,
      companyId,
      expiresAt,
      status: 'pending',
    });

    res.status(201).json({ message: 'Convite criado com sucesso.', invitation });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar convite.', error: error.message });
  }
};

// Verificar convite por token
exports.validateToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() },
        status: 'pending',
      },
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    res.status(200).json({
      message: 'Token válido.',
      email: invitation.email,
      companyId: invitation.companyId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar convite.', error: error.message });
  }
};

// Aceitar convite
exports.acceptInvitation = async (req, res) => {
  try {
    const { token, userId } = req.body;

    const invitation = await Invitation.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() },
        status: 'pending',
      },
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.email !== invitation.email) {
      return res.status(403).json({ message: 'E-mail do convite não corresponde ao do usuário.' });
    }

    // Associa o usuário à empresa
    await user.update({ companyId: invitation.companyId });

    // Marca o convite como aceito
    await invitation.update({ status: 'accepted' });

    res.status(200).json({ message: 'Convite aceito. Usuário associado à empresa.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aceitar convite.', error: error.message });
  }
};
