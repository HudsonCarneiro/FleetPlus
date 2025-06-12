const { Sequelize } = require('sequelize');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'admin',
  database: process.env.DB_NAME || 'fleetplus',
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
});

sequelize.authenticate()
  .then(() => {
    console.log(`Conectado ao banco ${dbConfig.database} com sucesso!`);
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });

module.exports = sequelize;
