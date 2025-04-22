const { DataTypes } = require ('sequelize');
const sequelize = require ('../config/database');

const Company = require.define('Company',{
    id: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        primaryKey: true,
    },
    cnpj: {
        type: DataTypes.STRING(14),
        allowNull: true,
    },
    companyName: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
    businessName: {
        type: DataTypes.STRING(55),
        allowNull: false,
    },
    addressId: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
          model: 'Addresses', // Nome da tabela Address no banco
          key: 'id',
        },
    }

})
