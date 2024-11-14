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
        // references: {
        //     model: 'Client',
        //     key: 'id',
        // }
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Driver',
        //     key: 'id',
        // }
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'Vehicle',
        //     key: 'id',
        // }
    }
});

//Associações do modelo Delivery
DeliveryOrder.associate = (models) => {
    DeliveryOrder.belongsTo(models.Client, { foreignKey: 'clientId' });
    DeliveryOrder.belongsTo(models.Driver, { foreignKey: 'driverId' });
    DeliveryOrder.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = DeliveryOrder;
