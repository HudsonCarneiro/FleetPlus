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
        unique: true,
        validate: {
            isNumeric: true, 
            len: [14, 14] 
        }
    },
    phone: {
        type: DataTypes.STRING(15), 
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100), 
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true 
        }
    },
    addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
            },
        
    },
      
}, {
    timestamps: true, // Habilita campos createdAt e updatedAt
    paranoid: true, // Habilita o campo deletedAt para soft deletes
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['cnpj'] },
    ],
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
