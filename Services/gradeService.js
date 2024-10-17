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

async function submitGrade(idtoken, score, ltik) {
  // Verificar LineItem ID
  const lineItemId = idtoken?.platformContext?.endpoint?.lineitem;
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
    where: { ltiUserId: user.ltiUserId, ativo: true },
  });
  if (!userModulo) {
    throw new Error("Módulo ativo não encontrado");
  }

  const gradeObj = {
    userId: idtoken.user,
    scoreGiven: score,
    scoreMaximum: 100,
    activityProgress: 'Completed',
    gradingProgress: 'FullyGraded'
  };

  try {
    // Enviar a nota
    const responseGrade = await lti.Grade.submitScore(idtoken, lineItemId, gradeObj);
    
    if (responseGrade) {
        await userModulo.update({ nota: score });
        return responseGrade;
    }
  } catch (error) {
    throw new Error(`Erro ao enviar a nota: ${error.message}`);
  }
}

module.exports = { submitGrade };
