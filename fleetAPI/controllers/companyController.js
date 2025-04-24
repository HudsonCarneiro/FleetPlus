const Company = require('../models/Company');
const Address = require('../models/Address');
const addressController = require('./addressController');


exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      attributes: ['cnpj', 'companyName', 'businessName', 'addressId']
    });

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: 'Empresa não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar empresa',
      details: error.message,
    });
  }
};


// Criar empresa
exports.createCompany = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { cnpj, companyName, businessName, address } = req.body;
  
      // Verifique se o CNPJ ou o Email já existem
      const existingCompany = await Client.findOne({
        where: {
          [Op.or]: [{ cnpj }],
        },
      });
  
      if (existingCompany) {
        return res.status(400).json({ message: 'CNPJ  já cadastrados.' });
      }
  
      const createdAddress = await Address.create({
        cep: address.cep,
        number: address.number,
        road: address.road,
        complement: address.complement,
        city: address.city,
        state: address.state,
      }, { transaction: t });
  
      const company = await Company.create({
        cnpj,
        companyName,
        businessName,
        addressId: createdAddress.id,
      }, { transaction: t });
  
      await t.commit();
      res.status(201).json(company);
    } catch (error) {
      await t.rollback();
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao criar empresa.', error: error.message });
    }
  };

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { password, ...updateData } = req.body;

      if (password) {
        // Gerar novo hash e salt
        const { salt, hashedPassword } = await hashPassword(password);
        updateData.password = hashedPassword;
        updateData.salt = salt;
      }

      await user.update(updateData);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário', details: error.message });
  }
};

// Excluir usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
  }
};


