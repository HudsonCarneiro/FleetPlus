const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const port = 3000;

app.use(cors());  // Permite requisições de diferentes origens
app.use(express.urlencoded({ extended: true })); // Para aceitar dados codificados em URL
app.use(express.json());  // Express lida com JSON

// Definir as rotas da API
const authRouter = require('./routes/authRoutes');
const addressRouter = require('./routes/addressRoutes');
const clientRouter = require('./routes/clientRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const deliveryOrderRouter = require('./routes/deliveryOrderRoutes');
const driverRouter = require('./routes/driverRoutes');
const fuelingRouter = require('./routes/fuelingRoutes');
const protectedRouter = require('./routes/protectedRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');

app.use('/api/', addressRouter);
app.use('/api/', authRouter);
app.use('/api/', clientRouter);
app.use('./api/', dashboardRouter);
app.use('/api/', deliveryOrderRouter);
app.use('/api/', driverRouter);
app.use('/api/', fuelingRouter);
app.use('/api/', protectedRouter);
app.use('/api/', userRouter);
app.use('/api/', vehicleRouter);


// Sincroniza os modelos/tabelas e inicia o servidor após a sincronização
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado com sucesso!');
        // Inicia o servidor após a sincronização
        app.listen(port, () => {
            console.log('Servidor rodando na porta: ' + port);
        });
    })
    .catch(err => {
        console.log('Erro ao sincronizar o banco de dados: ' + err);
    });

// Rota de saúde para verificar o status do servidor
app.get('/', (req, res) => {
    res.send('API está rodando!');
});

