const express = require('express');
const connectToDatabase = require('./db');

const router = express.Router();

// Rota de exemplo para buscar todos os países
router.get('/paises', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');

    // Executa a operação desejada no banco de dados, por exemplo:
    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info"
        }
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional: "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: { abreviacao: "$$moeda.abreviacao", nome: "$$moeda.nome" }
              }
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla"
          },
          geometry: "$geometry"
        }
      }
    ])
    .toArray();
    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países', error);
    res.status(500).json({ error: 'Erro ao buscar países' });
  }
});

// Rota para buscar todos os diferentes níveis de IDH do ano de 2021
router.get('/niveis-idh-2021', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');

    const niveisIDH = await db.collection('paises').aggregate([
      {
        $group: {
          _id: "$nivel_IDH_2021"
        }
      },
      {
        $project: {
          _id: 0,
          nivel_IDH_2021: "$_id"
        }
      }
    ]).toArray();

    res.json(niveisIDH);
  } catch (error) {
    console.error('Erro ao buscar níveis de IDH', error);
    res.status(500).json({ error: 'Erro ao buscar níveis de IDH' });
  }
});

// Rota para buscar países por nível de IDH
router.get('/paises-por-nivel-idh/:nivelidh', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');
    const nivelIDH = req.params.nivelidh.replace(/\s/g, '%20');

    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info"
        }
      },
      {
        $match: {
          nivel_IDH_2021: nivelIDH
        }
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional: "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: { abreviacao: "$$moeda.abreviacao", nome: "$$moeda.nome" }
              }
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla"
          },
          geometry: "$geometry"
        }
      }
    ]).toArray();

    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países por nível de IDH', error);
    res.status(500).json({ error: 'Erro ao buscar países por nível de IDH' });
  }
}
);

// Rota para buscar todos os diferentes continentes
router.get('/todos-continentes', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');

    const niveisIDH = await db.collection('paises').aggregate([
      {
        $group: {
          _id: "$continente"
        }
      },
      {
        $project: {
          _id: 0,
          continente: "$_id"
        }
      }
    ]).toArray();

    res.json(niveisIDH);
  } catch (error) {
    console.error('Erro ao buscar continentes', error);
    res.status(500).json({ error: 'Erro ao buscar continentes' });
  }
});


// Rota para buscar países por continente
router.get('/paises-por-continente/:cont', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');
    const cont = req.params.cont.replace(/\s/g, '%20');

    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info"
        }
      },
      {
        $match: {
          continente: cont
        }
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional: "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: { abreviacao: "$$moeda.abreviacao", nome: "$$moeda.nome" }
              }
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla"
          },
          geometry: "$geometry"
        }
      }
    ]).toArray();

    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países por continente', error);
    res.status(500).json({ error: 'Erro ao buscar países por continente' });
  }
}
);

// Rota para buscar todos os diferentes continentes
router.get('/todas-moedas', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');

    const niveisIDH = await db.collection('moedas').aggregate([
      {
        $group: {
          _id: "$abreviacao"
        }
      },
      {
        $project: {
          _id: 0,
          abreviacao: "$_id"
        }
      }
    ]).toArray();

    res.json(niveisIDH);
  } catch (error) {
    console.error('Erro ao buscar abreviacao das moedas', error);
    res.status(500).json({ error: 'Erro ao buscar abreviacao das moedas' });
  }
});


// Rota para buscar países por moeda
router.get('/paises-por-moeda/:abrevmoeda', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');
    const abrevmoeda = req.params.abrevmoeda;

    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info"
        }
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional: "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: { abreviacao: "$$moeda.abreviacao", nome: "$$moeda.nome" }
              }
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla"
          },
          geometry: "$geometry"
        }
      },
      {
        $match: {
          "properties.moeda.abreviacao": abrevmoeda
        }
      }
    ]).toArray();

    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países por moeda', error);
    res.status(500).json({ error: 'Erro ao buscar países por moeda' });
  }
}
);


// Rota para buscar países por língua
router.get('/paises-por-lingua/:lingua', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');
    const lingua = req.params.lingua;

    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info"
        }
      },
      {
        $match: {
          linguas: lingua
        }
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional: "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: { abreviacao: "$$moeda.abreviacao", nome: "$$moeda.nome" }
              }
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla"
          },
          geometry: "$geometry"
        }
      }
    ]
    ).toArray();

    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países por moeda', error);
    res.status(500).json({ error: 'Erro ao buscar países por moeda' });
  }
}
);

// Rota para buscar países por estimativa populacional
router.get('/paises-por-estimativa-populacional/:estpop', async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    const client = await connectToDatabase();
    const db = client.db('bdmpti');
    const estpop = req.params.estpop;

    const paises = await db.collection('paises').aggregate([
      {
        $lookup: {
          from: "moedas",
          localField: "moeda",
          foreignField: "_id",
          as: "moeda_info",
        },
      },
      {
        $match: {
          estimativa_populacional: { $lt: Number(estpop) },
        },
      },
      {
        $project: {
          _id: 0,
          type: { $literal: "Feature" },
          properties: {
            continente: "$continente",
            capital: "$capital",
            linguas: "$linguas",
            cod_telefone: "$cod_telefone",
            nivel_IDH_2021: "$nivel_IDH_2021",
            IDH_2021: "$IDH_2021",
            estimativa_populacional:
              "$estimativa_populacional",
            moeda: {
              $map: {
                input: "$moeda_info",
                as: "moeda",
                in: {
                  abreviacao: "$$moeda.abreviacao",
                  nome: "$$moeda.nome",
                },
              },
            },
            nome_br: "$nome_br",
            nome_en: "$nome_en",
            sigla: "$sigla",
          },
          geometry: "$geometry",
        },
      },
    ]
    ).toArray();

    // Retorna os dados como resposta
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países por moeda', error);
    res.status(500).json({ error: 'Erro ao buscar países por moeda' });
  }
}
);


module.exports = router;

