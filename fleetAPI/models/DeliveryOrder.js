const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryOrder = sequelize.define('DeliveryOrder', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
          },
    }
});

//Associações do modelo Delivery
DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.Client, { foreignKey: 'clientId' });
    DeliveryOrder.belongsTo(models.Driver, { foreignKey: 'driverId' });
    DeliveryOrder.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
    DeliveryOrder.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = DeliveryOrder;
