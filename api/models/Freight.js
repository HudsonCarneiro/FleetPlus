const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Freight = sequelize.define('Freight', {
    status: {
        type: DataTypes.STRING, // aguardando / em transito / finalizado
        allowNull: false,
    },
});

// Associações do modelo Freight
Freight.associate = (models) => {
    Freight.belongsTo(models.Client, { foreignKey: 'clientId' });
    Freight.belongsTo(models.Driver, { foreignKey: 'driverId' });
    Freight.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
};

module.exports = Freight;
