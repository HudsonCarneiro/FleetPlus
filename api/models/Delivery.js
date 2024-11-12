const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Delivery = sequelize.define('Delivery', {
    status: {
        type: DataTypes.STRING, // aguardando / em transito / finalizado
        allowNull: false,
    },
});

// Associações do modelo Delivery
Delivery.associate = (models) => {
    Delivery.belongsTo(models.Client, { foreignKey: 'clientId' });
    Freight.belongsTo(models.Driver, { foreignKey: 'driverId' });
    Freight.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = Delivery;
