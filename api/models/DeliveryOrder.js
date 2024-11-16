const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryOrder = sequelize.define('DeliveryOrder', {
    status: {
        type: DataTypes.ENUM('aguardando', 'enviado', 'finalizado'), 
        allowNull: false,
        defaultValue: 'aguardando'
    },
    deliveryDate: {
        type: DataTypes.DATE, // Data da entrega
        allowNull: true,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

//Associações do modelo Delivery
DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.Client, { foreignKey: 'clientId' });
    DeliveryOrder.belongsTo(models.Driver, { foreignKey: 'driverId' });
    DeliveryOrder.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = DeliveryOrder;
