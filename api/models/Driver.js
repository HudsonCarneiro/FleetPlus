const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  cnh:{
    type: DataTypes.STRING
  },
  phone:{
    type: DataTypes.STRING
  },
});
Driver.associate = (models) => {
  Driver.hasMany(models.Fueling, {
    foreignKey: 'driverId'
  })
}
Driver.associate = (models)=> {
  Driver.belongsTo(models.Address,{
      foreignKey: 'addressId'
  });
}
module.exports = Driver;