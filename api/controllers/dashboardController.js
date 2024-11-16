const User = require('../models/User');
const Address = require('../models/Address');

exports.getDashboard = async (req, res) => {
    try {
        // Encontra o usuário com base no ID do token
        const user = await User.findByPk(req.userId);

        // Caso o usuário não seja encontrado
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        //Buscar informações adicionais relacionadas ao usuário 
        const address = await Address.findOne({ where: { userId: user.id } });

        // Retorna as informações do dashboard, incluindo dados do usuário e endereço
        res.status(200).json({
            message: 'Bem-vindo ao seu Dashboard!',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            address: address ? {
                road: address.road,
                city: address.city,
                state: address.state,
                complement: address.complement,
            } : null,
        });

    } catch (error) {
        res.status(500).json({
            error: 'Erro ao carregar dados do Dashboard',
            details: error.message,
        });
    }
};
