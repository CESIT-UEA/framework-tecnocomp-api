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
  try {
    const user = await Aluno.findOne({ where: { ltik } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Buscar o módulo ativo do usuário
    const userModulo = await UsuarioModulo.findOne({
      where: { id_aluno: user.id_aluno, ativo: true },
    });

    if (!userModulo) {
      throw new Error("Modulo ativo não encontrado");
    }

    const modulo = await Modulo.findOne({
      where: { id: userModulo.id_modulo },
    });
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
              where: { id_aluno: user.id_aluno},
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
                id_aluno: user.id_aluno,
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
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { getDadosUser };
