const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  const uri = 'mongodb+srv://usersimple:ifpb1234@clusterz.yigbbi0.mongodb.net/bdmpti';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    // Retorna a instância do cliente conectado para usá-la em outras partes do backend
    return client;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    throw error;
  }
}

module.exports = connectToDatabase;
