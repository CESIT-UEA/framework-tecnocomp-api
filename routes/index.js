const express = require("express");
const router = express.Router();
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
  Aluno
} = require("../models");
const lti = require("ltijs").Provider;

// Rota para enviar a nota de um aluno
router.post("/grade", async (req, res) => {
  try {
    const idtoken = res.locals.token; // IdToken
    const score = req.body.grade; // User numeric score sent in the body

    // Creating Grade object
    let gradeObj = {
      userId: idtoken.user,
      scoreGiven: score,
      scoreMaximum: 100,
      activityProgress: "Completed",
      gradingProgress: "FullyGraded",
    };

    // Selecting lineItem ID
    let lineItemId = idtoken.platformContext.endpoint.lineitem; // Attempting to retrieve it from idtoken

    const ltiUserId = res.locals.ltik;
    const user = await Aluno.findOne({ where: { ltik: ltiUserId } });
    if (user) {
      const userModulo = await UsuarioModulo.findOne({
        where: { ltiUserId: user.ltiUserId, ativo: true },
      });
      if (userModulo) {
        await userModulo.update({ nota: score });
      } else {
        console.log("Módulo ativo não encontrado");
        return res.status(404).json({ error: "Módulo ativo não encontrado" });
      }
    } else {
      console.log("Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Sending Grade
    const responseGrade = await lti.Grade.submitScore(
      idtoken,
      lineItemId,
      gradeObj
    );

    return res.send(responseGrade);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ error: err.message });
  }
});

//Informações do usuario
router.get("/userInfo", async (req, res) => {
  try {
    const ltik = res.locals.ltik;
    const user = await Aluno.findOne({ where: { ltik } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userModulo = await UsuarioModulo.findOne({
      where: { ltiUserId: user.ltiUserId, ativo: true },
    });

    if (!userModulo) {
      return res.status(404).json({ error: "Módulo ativo não encontrado" });
    }

    const modulo = await Modulo.findOne({
      where: { id: userModulo.id_modulo },
    });

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
    const userTopico = await UsuarioTopico.findAll({
      where: { ltiUserId: user.ltiUserId },
    });

    return res.json({
      user,
      modulo,
      userModulo,
      topicos,
      userTopico,
    });
  } catch (err) {
    console.log("Modulo não encontrado com sucesso");
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
