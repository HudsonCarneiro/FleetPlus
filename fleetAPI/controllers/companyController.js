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

  exports.updateCompany = async (req, res) => {
    const { id } = req.params;
    const { cnpj, companyName, businessName, address } = req.body;
  
    const t = await sequelize.transaction();
    try {
      // Busca o cliente pelo ID
      const company = await Company.findByPk(id);
  
      if (!company) {
        await t.rollback();
        return res.status(404).json({ message: 'Empresa não encontrada.' });
      }
  
      // Atualizar o endereço usando a função reutilizável
      if (address) {
        await addressController.updateAddressbyId(company.addressId, address);
      }
  
      const updatedCompany= await company.update({
        cnpj,
        companyName,
        businessName,
      }, { transaction: t });
  
      await t.commit();
      res.status(200).json(updatedCompany);
    } catch (error) {
      await t.rollback();
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao atualizar empresa.', error: error.message });
    }
  };

  exports.deleteCompany = async (req, res) => {
    const { id } = req.params;
  
    const t = await sequelize.transaction();
    try {
      const company = await Company.findByPk(id);
  
      if (!company) {
        await t.rollback();
        return res.status(404).json({ message: 'empresa não encontrada.' });
      }
  
      // Excluir o cliente primeiro
      await company.destroy({ transaction: t });
  
      await t.commit();
      res.status(200).json({ message: 'Empresa excluída com sucesso.' });
    } catch (error) {
      await t.rollback();
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao excluir empresa.', error: error.message });
    }
  };
  


