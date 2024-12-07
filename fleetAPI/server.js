const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const port = 3000;

app.use(cors());  // Permite requisições de diferentes origens
app.use(express.urlencoded({ extended: true })); // Para aceitar dados codificados em URL
app.use(express.json());  // Express lida com JSON

// Definir as rotas da API
const addressRouter = require('./routes/addressRoutes');
const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const deliveryOrderRouter = require('./routes/deliveryOrderRoutes');
const driverRouter = require('./routes/driverRoutes');
const fuelingRouter = require('./routes/fuelingRoutes');
const userRouter = require('./routes/userRoutes');
const validateTokenRouter = require('./routes/validateTokenRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');

app.use('/api/', addressRouter);
app.use('/api/', authRouter);
app.use('/api/', clientRouter);
app.use('/api/', dashboardRouter);
app.use('/api/', deliveryOrderRouter);
app.use('/api/', driverRouter);
app.use('/api/', fuelingRouter);
app.use('/api/', userRouter);
app.use('/api', validateTokenRouter);
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

app.get('/', (req, res) => {
    res.send('API está rodando!');
});

