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

async function liberarProximoVideo(id_topico, ltik) {
  const user = await Aluno.findOne({ where: { ltik: ltik } });
  if (user) {
    const userTopico = await UsuarioTopico.findOne({
      where: { id_aluno: user.id_aluno, id_topico: id_topico },
    });
    if (userTopico) {
      userTopico.update({ encerrado: 1 });
      return userTopico;
    } else {
      throw new Error("Usuario cadastrado no modulo não encontrado");
    }
  } else {
    throw new Error("Usuario não encontrado");
  }
}

module.exports = { liberarProximoVideo };
