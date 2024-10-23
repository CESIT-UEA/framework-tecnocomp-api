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
  UsuarioVideo,
} = require("../models");
const { where } = require("sequelize");
const lti = require("ltijs").Provider;

async function getDadosUser(ltik) {
  const user = await Aluno.findOne({ where: { ltik } });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Buscar o módulo ativo do usuário
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
      {
        model: VideoUrls,
        include: [
          {
            model: UsuarioVideo, 
            where: { ltiUserId: user.ltiUserId },
            required: false, 
          },
        ],
      },
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
        required: true, 
        include: [
          {
            model: Aluno,
            required: true, 
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

  let dados_user = {
    user: user,
    modulo: modulo,
    userModulo: userModulo,
    topicos: topicos,
    userTopico: userTopico,
  };

  return dados_user;
}

module.exports = { getDadosUser };
