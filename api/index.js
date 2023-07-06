const express = require('express');
const routes = require('./routes');
var cors = require('cors')

const app = express();
const port = 3000; // Define a porta a ser usada para o servidor
app.use(cors())

app.use(express.json());
app.use('/api', routes); // Define um prefixo para as rotas

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

module.exports = app;
