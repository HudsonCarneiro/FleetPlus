const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

// Definindo o modelo User
User.init({
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
      model: 'Addresses', // Nome da tabela Address no banco
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users', // Nome da tabela no banco
  timestamps: true, // createdAt e updatedAt
});

// Definindo associações
User.associate = (models) => {
  // Relacionamentos de um para muitos
  User.hasMany(models.Client, {
    foreignKey: 'userId',
    as: 'clients',
  });
  User.hasMany(models.DeliveryOrder, {
    foreignKey: 'userId',
    as: 'deliveryOrders',
  });
  User.hasMany(models.Driver, {
    foreignKey: 'userId',
    as: 'drivers',
  });
  User.hasMany(models.Fueling, {
    foreignKey: 'userId',
    as: 'fuelings',
  });
  User.hasMany(models.Vehicle, {
    foreignKey: 'userId',
    as: 'vehicles',
  });

  // Relacionamento com Address (pertence a um endereço)
  User.belongsTo(models.Address, {
    foreignKey: 'addressId',
    as: 'address', // Ajustado para singular, já que é um único endereço
  });
};

module.exports = User;
