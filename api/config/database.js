const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

// Configurações do banco de dados
const dbConfig = {
  host: 'localhost',
  port: 3307, // Porta do MySQL
  user: 'root', // Usuário do MySQL
  password: '', // Senha do MySQL
  database: 'fleetplus', // Nome do banco de dados
};

// Função para criar o banco de dados, se ele não existir
async function createDatabase() {
  try {
    // Conecta ao MySQL sem especificar o banco de dados
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Cria o banco de dados se ele não existir
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Banco de dados '${dbConfig.database}' verificado/criado com sucesso.`);
    
    // Fecha a conexão
    await connection.end();
  } catch (error) {
    console.error('Erro ao criar/verificar o banco de dados:', error);
    process.exit(1); // Encerra o processo se falhar
  }
}

async function initializeSequelize() {
  // garante que o banco de dados existe
  await createDatabase();

  // Inicializa o Sequelize 
  const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
  });

  try {
    // Autentica a conexão 
    await sequelize.authenticate();
    console.log('Conectado com sucesso ao banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }

  return sequelize;
}

module.exports = initializeSequelize;
