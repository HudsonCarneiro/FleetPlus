const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    businessName: {
        type: DataTypes.STRING(255), 
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING(255), 
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(14), 
        allowNull: false,
        validate: {
            isNumeric: true, 
            len: [14, 14] 
        }
    },
    phone: {
        type: DataTypes.STRING(15), 
        allowNull: true,
        validate: {
            is: /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/ 
        }
    },
    email: {
        type: DataTypes.STRING(100), 
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true 
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
