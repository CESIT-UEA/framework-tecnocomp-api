const express = require("express");
const path = require("path");
const { Sequelize, Op } = require("sequelize");
const LtiSequelize = require("ltijs-sequelize");
const lti = require("ltijs").Provider;
const cors = require("cors");
const fs = require('fs');

const app = express();
app.use(express.json());

// Configurações do banco de dados
const sequelize = new Sequelize("tecnocomp", "tecnocomp", "0a463635baa5a", {
  host: '172.25.1.5',
  dialect: 'mysql', 
  port:3306,
  logging: false,
});

const db = new LtiSequelize("tecnocomp", "tecnocomp", "0a463635baa5a", {
  host: '172.25.1.5',
  dialect: 'mysql', 
  port:3306,
  logging: false,
});

// Configuração do LTI
lti.setup(
  "LTIKEY",
  { plugin: db },
  {
    cookies: { secure: false, sameSite: "" },
    devMode: false,
  },
  {https:true}
);

lti.app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

lti.app.use(
  ssl({
    key: fs.readFileSync('/certs/uea.edu.br.key'),
    cert: fs.readFileSync('/certs/uea.edu.br.fullchain.crt')
  })
);
// Importação dos modelos do Sequelize
const { Modulo, UsuarioModulo, Topico, UsuarioTopico, PlataformaRegistro, Aluno } = require("./models");
const { options } = require("./routes");

// Handler de conexão LTI
lti.onConnect(async (token, req, res) => {
  try {
    const ltik = req.query.ltik;
    let nomeModulo = token.platformContext.resource.title.toLowerCase().replace(/ /g, "-");

    const modulo = await Modulo.findOne({ where: { nome_modulo: nomeModulo } });

    if (modulo) {
      const user = await Aluno.findOne({ where: { ltiUserId: token.user } });
      if (user) {
        await updateUser(user, ltik, modulo, token);
      } else {
        await createUser(token, ltik, modulo);
      }
      res.redirect(`http://localhost:4200/modulo/${nomeModulo}?ltik=${ltik}`);
    } else {
      res.redirect("http://localhost:4200/error404");
      console.log("Modulo não existe");
    }
  } catch (error) {
    console.error("Erro na conexão LTI:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

// Função para criar novo usuário
async function createUser(token, ltik, modulo) {
  const user = await Aluno.create({
    ltiUserId: token.user,
    nome: token.userInfo.name,
    email: token.userInfo.email,
    ltik: ltik,
  });

  await UsuarioModulo.create({ id_modulo: modulo.id, ltiUserId: token.user });

  const topicos = await Topico.findAll({ where: { id_modulo: modulo.id } });
  for (let topico of topicos) {
    await UsuarioTopico.create({ ltiUserId: token.user, id_topico: topico.id });
  }
}

// Função para atualizar usuário existente
async function updateUser(user, ltik, modulo, token) {
  await user.update({ ltik: ltik });

  await UsuarioModulo.update(
    { ativo: false },
    { where: { ltiUserId: user.ltiUserId, id_modulo: { [Op.ne]: modulo.id } } }
  );

  const userModulo = await UsuarioModulo.findOne({
    where: { id_modulo: modulo.id, ltiUserId: user.ltiUserId },
  });

  if (userModulo) {
    await userModulo.update({ ativo: true });
  } else {
    await UsuarioModulo.create({ id_modulo: modulo.id, ltiUserId: token.user });
  }

  const topicos = await Topico.findAll({ where: { id_modulo: modulo.id } });
  for (let topico of topicos) {
    const userTopico = await UsuarioTopico.findOne({
      where: { ltiUserId: token.user, id_topico: topico.id },
    });

    if (!userTopico) {
      await UsuarioTopico.create({ ltiUserId: token.user, id_topico: topico.id });
    }
  }
}

// Importação das rotas
lti.app.use("/", require("./routes"));

// Função para registrar plataformas
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

// Configuração e inicialização do servidor
const setup = async () => {
  try {
    await lti.deploy({port:8002});

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
