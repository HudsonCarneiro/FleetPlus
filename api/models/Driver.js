const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    name: {
        type: DataTypes.STRING(100), // Limitação sugerida para o nome
        allowNull: false
    },
    cnh: {
        type: DataTypes.STRING(11), // Limite para CNH (11 dígitos)
        allowNull: false,
        validate: {
            isNumeric: true, // Garante que apenas números são aceitos
            len: [11, 11] // Exige exatamente 11 dígitos
        }
    },
    phone: {
        type: DataTypes.STRING(15), // Limite telefone
        allowNull: true, 
        validate: {
            is: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/ // Validação telefone 
        }
    },
});

Driver.associate = (models) => {
    Driver.hasMany(models.Fueling, {
        foreignKey: 'driverId'
    });
    Driver.belongsTo(models.Address, {
        foreignKey: 'addressId'
    });
};

module.exports = Driver;
