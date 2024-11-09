const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const sequelize = require('./config/database');
const addressRouter = require('./routes/addressRoutes');
const clientRouter = require('./routes/clientRoutes');
const driverRouter = require('./routes/driverRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.json());
app.use('/api', [
    addressRouter,
    clientRouter,
    driverRouter,
    userRouter,
    vehicleRouter
]);

sequelize.sync()
.then(() => console.log('Database criado'))
.catch(err => console.log('Erro ao criar o banco: '+err));

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log('Servidor na porta: ' + port);
})