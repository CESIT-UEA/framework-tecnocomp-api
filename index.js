const express = require("express");
const path = require("path");
const { Sequelize, Op } = require("sequelize");
const LtiSequelize = require("ltijs-sequelize");
const lti = require("ltijs").Provider;
const cors = require("cors");

const app = express();
app.use(express.json());

const sequelize = new Sequelize("db", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const db = new LtiSequelize("db", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

lti.setup(
  "LTIKEY",
  {
    plugin: db,
  },
  {
    cookies: {
      secure: false,
      sameSite: "",
    },
    devMode: true,
  }
);

lti.app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Importa os modelos do Sequelize e passa a instância de conexão

const { Modulo, UsuarioModulo, Topico, UsuarioTopico, PlataformaRegistro, Aluno } = require("./models");

lti.onConnect(async (token, req, res) => {
  const ltik = req.query.ltik;
  let nomeModulo = token.platformContext.resource.title;

  const responseDados = await lti.NamesAndRoles.getMembers(res.locals.token, {
    resourceLinkId: true,
  });

  let formatadoNomeModulo = nomeModulo.toLowerCase().replace(/ /g, "-");

  const modulo = await Modulo.findOne({
    where: { nome_modulo: formatadoNomeModulo },
  });

  if (modulo) {
    const user = await Aluno.findOne({ where: { ltiUserId: token.user } });

    if (user) {
      console.log("LTIK do usuario atualizado com sucesso");
      // Se o usuário existir, atualiza
      await user.update({
        ltik: ltik,
      });

      const userModulo = await UsuarioModulo.findOne({
        where: { id_modulo: modulo.id, ltiUserId: user.ltiUserId },
      });

      // Desativa todos os módulos do usuário, exceto o módulo atual
      await UsuarioModulo.update(
        { ativo: false },
        {
          where: {
            ltiUserId: user.ltiUserId,
            id_modulo: { [Op.ne]: modulo.id },
          },
        }
      );

      if (userModulo) {
        console.log("Já cadastrado");
        // Se o usuário já estiver cadastrado neste módulo, ativa
        await userModulo.update({ ativo: true });
        const topicos = await Topico.findAll({
          where: { id_modulo: modulo.id },
        });

        // Para cada tópico, verifica se o usuário já está cadastrado
        for (let topico of topicos) {
          const userTopico = await UsuarioTopico.findOne({
            where: { ltiUserId: token.user, id_topico: topico.id },
          });

          // Se o usuário não estiver cadastrado neste tópico, cria uma nova entrada
          if (!userTopico) {
            await UsuarioTopico.create({
              ltiUserId: token.user,
              id_topico: topico.id,
            });
          }
        }
      } else {
        console.log(modulo.id);
        // Se o usuário não estiver cadastrado neste módulo, cria uma nova entrada e ativa
        await UsuarioModulo.create({
          id_modulo: modulo.id,
          ltiUserId: token.user,
        });

        const topicos = await Topico.findAll({
          where: { id_modulo: modulo.id },
        });

        // Para cada tópico, verifica se o usuário já está cadastrado
        for (let topico of topicos) {
          const userTopico = await UsuarioTopico.findOne({
            where: { ltiUserId: token.user, id_topico: topico.id },
          });

          // Se o usuário não estiver cadastrado neste tópico, cria uma nova entrada
          if (!userTopico) {
            await UsuarioTopico.create({
              ltiUserId: token.user,
              id_topico: topico.id,
            });
          }
        }
        console.log("Não cadastrado neste modulo, mas o usuario já existe");
      }
    } else {
      await Aluno.create({
        ltiUserId: token.user,
        nome: token.userInfo.name,
        email: token.userInfo.email,
        ltik: ltik,
      });

      await UsuarioModulo.create({
        id_modulo: modulo.id,
        ltiUserId: token.user,
      });

      const topicos = await Topico.findAll({
        where: { id_modulo: modulo.id },
      });

      console.log(topicos);

      for (let topico of topicos) {
        await UsuarioTopico.create({
          ltiUserId: token.user,
          id_topico: topico.id,
        });
      }
    }
    console.log(formatadoNomeModulo);
    res.redirect(
      `http://localhost:4200/modulo/${formatadoNomeModulo}?ltik=${ltik}`
    );
  } else {
    res.redirect(`http://localhost:4200/error404`);
    console.log("Modulo não existe");
  }
});

lti.app.use("/", require("./routes"));

const plataforma = async () => {
  try {
    const plataforma = await PlataformaRegistro.findAll({
      attributes: ["plataformaNome", "plataformaUrl", "idCliente"],
    });
    console.log(plataforma)
    return plataforma;
  } catch (error) {
    console.error("Erro ao buscar plataformas:", error);
    return [];
  }
};

const setup = async () => {
  try {
    await lti.deploy({ port: process.env.PORT || 3000 });

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
