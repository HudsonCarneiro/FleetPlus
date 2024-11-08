const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {}

User = sequelize.define('User', {
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
}, {
    hooks: {
      beforeCreate: async (user) => {
        if(user.password){
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password){
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
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