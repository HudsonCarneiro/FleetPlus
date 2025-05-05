const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Invitation extends Model {}

Invitation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  invitedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'expired'),
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Invitation',
  tableName: 'Invitations',
  timestamps: true,
});

module.exports = Invitation;
