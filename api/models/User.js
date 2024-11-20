const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

// Definindo o modelo User
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false, // Salt será obrigatório
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Addresses',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Nome da tabela no banco
    timestamps: true, // createdAt e updatedAt
  }
);

// Definindo associações
User.associate = (models) => {
  User.hasMany(models.Fueling, {
    foreignKey: 'userId',
    as: 'fuelings',
  });

  User.belongsTo(models.Address, {
    foreignKey: 'addressId',
    as: 'address',
  });
};

module.exports = User;
