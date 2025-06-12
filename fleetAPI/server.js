const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan'); // Logger para requisições
const sequelize = require('./config/database');
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev')); // Logger para requisições

// Definir as rotas da API
const addressRouter = require('./routes/addressRoutes');
const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const deliveryOrderRouter = require('./routes/deliveryOrderRoutes');
const driverRouter = require('./routes/driverRoutes');
const fuelingRouter = require('./routes/fuelingRoutes');
const reportRouter = require('./routes/reportRoutes.js');
const userRouter = require('./routes/userRoutes');
const validateTokenRouter = require('./routes/validateTokenRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');

const routers = [
  addressRouter,
  authRouter,
  clientRouter,
  dashboardRouter,
  deliveryOrderRouter,
  driverRouter,
  fuelingRouter,
  reportRouter,
  userRouter,
  validateTokenRouter,
  vehicleRouter,
];

routers.forEach((router) => app.use('/api/', router));

// Sincroniza os modelos/tabelas e inicia o servidor após a sincronização
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso!');
    if (require.main === module) {
      app.listen(port, () => {
        console.log('Servidor rodando na porta: ' + port);
      });
    }
    module.exports = app;

    if (process.env.NODE_ENV !== 'production') {
      const runTests = async () => {
        try {
          console.log('\nExecutando testes automáticos...');
          const { exec } = require('child_process');
          exec('npm test', (error, stdout, stderr) => {
            if (error) {
              console.error(`Erro ao executar os testes: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Erros nos testes: ${stderr}`);
            }
            console.log(stdout);
          });
        } catch (err) {
          console.error('Erro ao rodar testes:', err);
        }
      };

      runTests();
    }
  })
  .catch(err => {
    console.log('Erro ao sincronizar o banco de dados: ' + err);
  });

// Rota inicial
app.get('/', (req, res) => {
  res.send('API está rodando!');
});

