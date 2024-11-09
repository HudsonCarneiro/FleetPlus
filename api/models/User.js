const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {}

// Definindo o modelo User
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, // Valida o formato do CPF
      len: [14, 14] // O CPF deve ter exatamente 14 caracteres (formato 123.456.789-01)
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\(\d{2}\) \d{5}-\d{4}$/ // Valida o formato do telefone (XX) XXXXX-XXXX
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante que o e-mail seja único no banco de dados
    validate: {
      isEmail: true // Valida que o campo seja um e-mail válido
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Definindo associações
User.associate = (models) => {
  // Associação com Fueling
  User.hasMany(models.Fueling, {
    foreignKey: 'userId'
  });

  // Associação com Address
  User.belongsTo(models.Address, {
    foreignKey: 'addressId'
  });
};

module.exports = User;
