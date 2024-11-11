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

