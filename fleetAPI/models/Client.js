const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    businessName: {
        type: DataTypes.STRING(255), // Limite de 255 caracteres
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING(255), // Limite de 255 caracteres
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(14), // CNPJ tem 14 dígitos
        allowNull: false,
        validate: {
            isNumeric: true, // Garante que só aceita números
            len: [14, 14] // Exige exatamente 14 caracteres
        }
    },
    phone: {
        type: DataTypes.STRING(15), // Limite para o telefone
        allowNull: true,
        validate: {
            is: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/ // Validação para telefone brasileiro
        }
    },
    email: {
        type: DataTypes.STRING(100), // Limite de 100 caracteres para o email
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true // Garante que o valor é um email válido
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
          },
      
    },
    addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
});

Client.associate = (models) => {
    Client.hasMany(models.Freight, {
        foreignKey: 'clientId'
    });
    Client.belongsTo(models.Address, {
        foreignKey: 'addressId'
    });

    Client.belongsTo(models.User, { foreignKey: 'userId' });
};


module.exports = Client;
