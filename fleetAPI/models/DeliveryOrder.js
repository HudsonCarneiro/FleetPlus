const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryOrder = sequelize.define('DeliveryOrder', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    deliveryDate: {
        type: DataTypes.DATE, 
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('aguardando', 'enviado', 'finalizado'), 
        allowNull: false,
        defaultValue: 'aguardando'
    },
    urgency: {
        type: DataTypes.ENUM('verde', 'amarela', 'vermelha'), 
        allowNull: false,
        defaultValue: 'verde'
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients',
            key: 'id',
          },
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Drivers',
            key: 'id',
          },
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehicles',
            key: 'id',
          },
        
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Companies',
            key: 'id',
          },
    }
});

//Associações do modelo Delivery
DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.Client, { 
        foreignKey: 'clientId',
        as: 'client' 
    });
    DeliveryOrder.belongsTo(models.Driver, { 
        foreignKey: 'driverId',
        as: 'driver'
    });
    DeliveryOrder.belongsTo(models.Vehicle, { 
        foreignKey: 'vehicleId',
        as: 'vehicle'
    });
    DeliveryOrder.belongsTo(models.Company, { 
        foreignKey: 'companyId',
        as: 'company'
    });
};

module.exports = DeliveryOrder;
