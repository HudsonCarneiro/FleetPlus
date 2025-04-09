const { Sequelize } = require('sequelize');

// Configuração do banco de dados via variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fleetplus',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  }
);

// Testando a conexão com o banco de dados
const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao banco de dados!');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados. Tentando novamente em 5 segundos...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

module.exports = sequelize;
