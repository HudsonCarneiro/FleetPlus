const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config/database');
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());  

const dashboardRouter = require('./routes/dashboardRoutes');
const userRouter = require('./routes/userRoutes');
const validateTokenRouter = require('./routes/validateTokenRoutes');

app.use('/api/', dashboardRouter);
app.use('/api/', userRouter);
app.use('/api', validateTokenRouter);

sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado com sucesso!');
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

