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
    allowNull: false,
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
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Companies',
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users', // Nome da tabela no banco
  timestamps: true, // createdAt e updatedAt
});

// Definindo associações
User.associate = (models) => {
  // Cada usuário pertence a uma empresa
  User.belongsTo(models.Company, {
    foreignKey: 'companyId',
    as: 'company',
    onDelete: 'RESTRICT'
  });

  // Cada usuário pode ter um endereço (se for o caso do sistema)
  User.belongsTo(models.Address, {
    foreignKey: 'addressId',
    as: 'address',
  });
};


module.exports = User;
/*
'CASCADE'	Se apagar a empresa, apaga todos os usuários ligados a ela. 
'SET NULL'	Se apagar a empresa, o companyId dos usuários vira null. 🫥
'RESTRICT'	Não deixa apagar a empresa se ainda tiver usuário ligado a ela. 
'NO ACTION'	Igual o RESTRICT, mas depende do DB. Não faz nada automaticamente.
*/
