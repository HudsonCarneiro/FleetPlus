const User = require('../models/User');

exports.getUserAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar usuarios'
        })
    }
}
exports.getUserById = async (req, res) =>{
    try{
        const user = await User.findByPk(req.params.id);
        if(user){
            res.json(user);
        }else{
            res.status(404).json({error: 'Usuário não encontrado.'})
        }

    }catch(error){
        res.status(500).json({error: 'Erro ao buscar usuário'});
    }
}
exports.createUser = async (req, res) => {
    try{
        const newUser = await User.create(req.body);
        res.status(201).json(newUser)
    } catch (error){
        res.status(500).json({
            error: 'Erro ao criar usuário'
        })
    }
}
exports.updateUser = async (req, res)=>{
    try{
        const user = await User.findByPk(req.params.id);
        if(user){
            await user.update(req.body);
            res.json(user);
        }else{
            res.status(404).json({error: 'Usuário não encontrado'})
        }
    }catch(error){
        res.status(500).json({error: 'Error ao atualizar o usuário'})
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(user){
            await User.destroy({
                where: {
                    id: req.params.id
                }
            })
            res.status(204).send();
        }else{
            res.status(204).json({error: "usuário não encontrado"})
        }
    }catch (error){
        res.status(500).json({error: 'Erro ao deletar usuário'});
    }
}
exports.loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ were: { email } });
        
        if(!user){
            return res.status(404).json({ error: 'Usuário não encontrado'});
        }
        
        const isMatch = await bcrypt.compare(senha, user.senha);

        if(!isMatch){
            return res.status(401).json({ error: 'Senha Incorreta'});
        }
        res.status(200).json({ message: 'Login concluido com sucesso'});
    }catch(error){
        res.status(500).json({ error: 'Erro ao fazer login'});
    }
}