require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const { Sequelize, Op, where } = require("sequelize");
const LtiSequelize = require("ltijs-sequelize");
const lti = require("ltijs").Provider;
const cors = require("cors");
const usuarioService = require("./Services/usuarioService");
const app = express();
app.use(express.json());

// Configurações do banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

const db = new LtiSequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false,
  }
);

let sslOptions;

if (process.env.PRODUCAO_VARIAVEL == "true") {
  sslOptions = {
    key: fs.readFileSync("/certs/uea.edu.br.key"),
    cert: fs.readFileSync("/certs/uea.edu.br.fullchain.crt"),
  }; 
  
  /* sslOptions = {
    key: fs.readFileSync("/certs/privkey.pem"),
    cert: fs.readFileSync("/certs/fullchain.pem"),
  }; */
}

lti.setup(
  process.env.LTI_KEY,
  { plugin: db },
  {
    cookies: { secure: false, sameSite: "" },
    devMode: true,
  }
);
urlFront = process.env.CORS_ORIGIN;

lti.app.use(
  cors({
    origin: 'https://licomp.com.br',
    credentials: true,
  })
);

const {
  Modulo,
  PlataformaRegistro,
  Aluno,
} = require("./models");
const { options } = require("./routes");

lti.onConnect(async (token, req, res) => {
  try {
    console.log(token);
    const ltik = req.query.ltik;
    let nomeModulo = token.platformContext.resource.title;
    let uuid = token.platformContext.custom.uuid;

    const plataforma = await PlataformaRegistro.findOne({
      where: { idCliente: token.clientId },
    });

    const modulo = await Modulo.findOne({ where: { uuid: uuid } });
    console.log(plataforma);
    if (modulo) {
      const user = await Aluno.findOne({
        where: { ltiUserId: token.user, id_plataforma: plataforma.id },
      });
      if (user) {
        await usuarioService.updateUser(user, ltik, modulo, token);
      } else {
        await usuarioService.createUser(token, ltik, modulo, plataforma);
      }
      console.log(`${urlFront}/modulo/${modulo.nome_url}?ltik=${ltik}`);
      res.redirect(`${urlFront}/modulo/${modulo.nome_url}?ltik=${ltik}`);
    } else {
      res.redirect(`${urlFront}/error404`);
      console.log("Modulo não existe ou não encontrado");
    }
  } catch (error) {
    console.error("Erro na conexão LTI:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

lti.app.use("/", require("./routes"));
const plataforma = async () => {
  try {
    const plataformas = await PlataformaRegistro.findAll({
      attributes: ["plataformaNome", "plataformaUrl", "idCliente"],
    });
    return plataformas;
  } catch (error) {
    console.error("Erro ao buscar plataformas:", error);
    return [];
  }
};

if (process.env.PRODUCAO_VARIAVEL == "true") {
  https.createServer(sslOptions, lti.app).listen(8002, () => {
    console.log("Servidor HTTPS rodando na porta 8002");
  });
}
// Função de setup
const setup = async () => {
  try {
    await lti.deploy({ port: 3000 }); // O deploy é necessário para inicializar o LTI, mas a porta será gerida pelo HTTPS criado manualmente

    // Registro das plataformas
    const registerPlataforma = await plataforma();

    for (let platform of registerPlataforma) {
      const { plataformaUrl, plataformaNome, idCliente } = platform.dataValues;
      if (plataformaUrl && plataformaNome && idCliente) {
        await lti.registerPlatform({
          url: plataformaUrl,
          name: plataformaNome,
          clientId: idCliente,
          authenticationEndpoint: `${plataformaUrl}/mod/lti/auth.php`,
          accesstokenEndpoint: `${plataformaUrl}/mod/lti/token.php`,
          authConfig: {
            method: "JWK_SET",
            key: `${plataformaUrl}/mod/lti/certs.php`,
          },
        });
        console.log(`Plataforma registrada: ${plataformaNome}`);
      } else {
        console.warn(`Dados incompletos para a plataforma: ${platform}`);
      }
    }
  } catch (error) {
    console.error("Erro durante o setup:", error);
  }
};

setup();
