const {
    UsuarioModulo,
    Modulo,
    Topico,
    UsuarioTopico,
    VideoUrls,
    SaibaMais,
    Referencias,
    Exercicios,
    Alternativas,
    Aluno,
  } = require("../models");
const { where } = require("sequelize");
const lti = require("ltijs").Provider;

async function getDadosUser(ltik) {
  const user = await Aluno.findOne({ where: { ltik } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const userModulo = await UsuarioModulo.findOne({
    where: { ltiUserId: user.ltiUserId, ativo: true },
  });

  if (!userModulo) {
    throw new Error("Modulo ativo não encontrado");
  }

  const modulo = await Modulo.findOne({ where: { id: userModulo.id_modulo } });
  if (!modulo) {
    throw new Error("Modulo não encontrado");
  }

  const topicos = await Topico.findAll({
    where: { id_modulo: modulo.id },
    include: [
      VideoUrls,
      SaibaMais,
      Referencias,
      {
        model: Exercicios,
        include: [Alternativas],
      },
    ],
  });

  const userTopico = await Topico.findAll({
    include: [
      {
        model: UsuarioTopico,
        required: true, // Equivalente a um INNER JOIN
        include: [
          {
            model: Aluno,
            required: true, // Equivalente a um INNER JOIN
            where: {
              ltiUserId: user.ltiUserId,
            },
          },
        ],
      },
    ],
    where: {
      id_modulo: modulo.id,
    },
  });
  let dados_user = { user: user,modulo: modulo,userModulo: userModulo,topicos: topicos, userTopico: userTopico }
  return dados_user;
}

module.exports = { getDadosUser };
