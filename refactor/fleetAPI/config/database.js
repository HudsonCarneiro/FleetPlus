const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'fleetplus',
   
};

const pool = mysql.createPool(dbConfig);


async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão bem-sucedida ao banco de dados!');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
}

testConnection();

module.exports = pool;
