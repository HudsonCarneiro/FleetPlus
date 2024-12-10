const Address = require('../models/Address');


exports.getAddressById = async (req, res) =>{
    try{
        const address = await Address.findByPk(req.params.id);
        if(address){
            res.json(address);
        }else{
            res.status(404).json({error: 'Endereço não encontrado.'})
        }

    }catch(error){
        res.status(500).json({error: 'Erro ao buscar endereço'});
    }
}

exports.getAddressbyId = async (id) => {
  try {
    const address = await Address.findByPk(id);
    if (address) {
      return address; // Retorna o endereço
    } else {
      return null; // Endereço não encontrado
    }
  } catch (error) {
    throw new Error('Erro ao buscar endereço: ' + error.message);
  }
};

exports.createAddress = async (req, res) => {
    try{
        const newAddress = await Address.create(req.body);
        res.status(201).json(newAddress)
    } catch (error){
        res.status(500).json({
            error: 'Erro ao criar endereço'
        })
    }
}
exports.updateAddress = async (req, res)=>{
    try{
        const address = await Address.findByPk(req.params.id);
        if(address){
            await address.update(req.body);
            res.json(address);
        }else{
            res.status(404).json({error: 'Endereço não encontrado'})
        }
    }catch(error){
        res.status(500).json({error: 'Error ao atualizar endereço'})
    }
}
exports.updateAddressbyId = async (id, addressData) => {
  try {
    const address = await Address.findByPk(id);
    if (!address) {
      throw new Error('Endereço não encontrado.');
    }

    const updatedAddress = await address.update(addressData);
    return updatedAddress; // Retorna o endereço atualizado
  } catch (error) {
    throw new Error('Erro ao atualizar endereço: ' + error.message);
  }
};

exports.deleteAddress = async (req, res) => {
    try {
      const address = await Address.findByPk(req.params.id);
      if (address) {
        await address.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Endereço não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
    }
  };
  
  exports.deleteAddressbyId = async (id) => {
    try {
      const address = await Address.findByPk(id);
      if (!address) {
        throw new Error('Endereço não encontrado.');
      }
  
      await address.destroy(); // Exclui o endereço
      return true; // Indica sucesso
    } catch (error) {
      throw new Error('Erro ao deletar endereço: ' + error.message);
    }
  };
  
