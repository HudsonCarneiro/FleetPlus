const { Sequelize } = require('sequelize');

const dbConfig = {
  host: 'localhost',     
  port: 3307,            
  user: 'root',          
  password: '',       
  database: 'appweb', 
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'mysql', 
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida ao banco de dados!');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });

module.exports = sequelize;
