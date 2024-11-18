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

async function submitGrade(
  idtoken,
  score,
  ltik,
  activityProgress,
  gradingProgress
) {
  // Verificar LineItem ID
  const lineItemId = idtoken?.platformContext?.endpoint?.lineitem;
  console.log(lineItemId)
  if (!lineItemId) {
    throw new Error("LineItem ID não encontrado");
  }

  // Verificar usuário no banco
  const user = await Aluno.findOne({ where: { ltik: ltik } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Verificar módulo ativo
  const userModulo = await UsuarioModulo.findOne({
    where: { id_aluno: user.id_aluno, ativo: true },
  });
  if (!userModulo) {
    throw new Error("Módulo ativo não encontrado");
  }

  const gradeObj = {
    userId: idtoken.user,
    scoreGiven: score,
    scoreMaximum: 100,
    activityProgress: activityProgress,
    gradingProgress: gradingProgress,
  };
  console.log(gradeObj);
  console.log(idtoken)
  try {
    // Enviar a nota
    const responseGrade = await lti.Grade.submitScore(
      idtoken,
      lineItemId,
      gradeObj
    );
    console.log(responseGrade);
    if (responseGrade) {
      await userModulo.update({ nota: score });
      return responseGrade;
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Erro ao enviar a nota: ${error.message}`);
  }
}

module.exports = { submitGrade };
