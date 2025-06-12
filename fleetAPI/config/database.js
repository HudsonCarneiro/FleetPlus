const { Sequelize } = require('sequelize');

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'fleetplus',
};


const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'mysql', 
});

// Testando a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida ao banco de dados!');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1); // Encerra o processo em caso de erro
  });

module.exports = sequelize;

