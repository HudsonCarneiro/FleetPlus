const { Sequelize } = require('sequelize');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',     
  port: 3307,            
  user: 'root',          
  password: '',       
  database: 'fleetplus', 
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

