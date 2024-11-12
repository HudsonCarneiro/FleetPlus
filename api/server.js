const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const sequelize = require('./config/database');
const addressRouter = require('./routes/addressRoutes');
const clientRouter = require('./routes/clientRoutes');
const deliveryOrderRouter = require('./routes/deliveryOrderRoutes');
const driverRouter = require('./routes/driverRoutes');
const fuelingRouter = require('./routes/fuelingRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');

app.use(cors());  // CORS para permitir requisições de diferentes origens
app.use(express.urlencoded({ extended: true })); // Para aceitar dados codificados em URL
app.use(express.json());  // Express lida com JSON

app.use('/api/address', addressRouter);
app.use('/api/client', clientRouter);
app.use('/api/deliveryOrder', deliveryOrderRouter);
app.use('/api/driver', driverRouter);
app.use('/api/fueling', fuelingRouter);
app.use('/api/user', userRouter);
app.use('/api/vehicle', vehicleRouter);

sequelize.sync()
    .then(() => console.log('Banco de dados criado com sucesso!'))
    .catch(err => console.log('Erro ao criar o banco: ' + err));

// Rota de saúde para verificar o status do servidor
app.get('/', (req, res) => {
    res.send('API está rodando!');
});

app.listen(port, () => {
    console.log('Servidor rodando na porta: ' + port);
});
