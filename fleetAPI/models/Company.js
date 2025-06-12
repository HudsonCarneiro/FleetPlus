const { DataTypes } = require ('sequelize');
const sequelize = require ('../config/database');

const Company = require.define('Company',{
    id: {
        type: DataTypes.INTEGER,
        autoincrement: true,
        primaryKey: true,
    },

})
