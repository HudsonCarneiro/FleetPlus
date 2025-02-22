const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100), 
        allowNull: false
    },
    cnh: {
        type: DataTypes.STRING(25), 
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true, 
            len: [11, 11] 
        }
    },
    phone: {
        type: DataTypes.STRING(25), 
        allowNull: true, 
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
      
    },
});

Driver.associate = (models) => {
    Driver.hasMany(models.Fueling, {
        foreignKey: 'driverId'
    });
    Driver.belongsTo(models.User, { 
        foreignKey: 'userId' 
    });
};

module.exports = Driver;
