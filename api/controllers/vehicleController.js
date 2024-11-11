const Vehicle = require('../models/Vehicle');

exports.getVehicleAll = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar veiculos'
        })
    }
}
exports.getVehicleById = async (req, res) =>{
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if(vehicle){
            res.json(vehicle);
        }else{
            res.status(404).json({error: 'Veiculo não encontrado.'})
        }

    }catch(error){
        res.status(500).json({error: 'Erro ao buscar veiculo'});
    }
}
exports.createVehicle = async (req, res) => {
    try{
        const newVehicle = await Vehicle.create(req.body);
        res.status(201).json(newVehicle)
    } catch (error){
        res.status(500).json({
            error: 'Erro ao criar veiculo'
        })
    }
}
exports.updateVehicle = async (req, res)=>{
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if(vehicle){
            await vehicle.update(req.body);
            res.json(vehicle);
        }else{
            res.status(404).json({error: 'Veiculo não encontrado'})
        }
    }catch(error){
        res.status(500).json({error: 'Error ao atualizar veiculo'})
    }
}

exports.deleteVehicle = async (req, res) => {
    try{
        const vehicle = await Vehicle.findByPk(req.params.id);
        if(vehicle){
            await Vehicle.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(204).send();
        }else{
            res.status(404).json({error: "Veiculo não encontrado"})
        }
    }catch (error){
        res.status(500).json({error: 'Erro ao deletar veiculo'});
    }
}