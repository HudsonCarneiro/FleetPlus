const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  cpf:{
    type: DataTypes.STRING
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

User.associate = (models) => {
  User.hasMany(models.Fueling, {
    foreignKey: 'userId'
  })
}
User.associate = (models)=> {
  User.belongsTo(models.Address,{
      foreignKey: 'addressId'
  });
}

module.exports = User;