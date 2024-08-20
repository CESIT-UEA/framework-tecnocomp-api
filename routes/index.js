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
  Aluno,
} = require("../models");
const { where } = require("sequelize");
const lti = require("ltijs").Provider;

// Função para enviar a nota de um aluno
router.post("/grade", async (req, res) => {
  console.log("Entrei na Grade")
  try {
    const idtoken = res.locals.token;
    const { grade: score } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: "Nota inválida" });
    }

    const gradeObj = {
      userId: idtoken.user,
      scoreGiven: score,
      scoreMaximum: 100,
      activityProgress: "Completed",
      gradingProgress: "FullyGraded",
    };

    const lineItemId = idtoken.platformContext.endpoint.lineitem;

    const ltiUserId = res.locals.ltik;
    const user = await Aluno.findOne({ where: { ltik: ltiUserId } });

    if (!user) {
      console.log("Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userModulo = await UsuarioModulo.findOne({
      where: { ltiUserId: user.ltiUserId, ativo: true },
    });

    if (!userModulo) {
      console.log("Módulo ativo não encontrado");
      return res.status(404).json({ error: "Módulo ativo não encontrado" });
    }

    await userModulo.update({ nota: score });

    const responseGrade = await lti.Grade.submitScore(idtoken, lineItemId, gradeObj);
    return res.json(responseGrade);

  } catch (err) {
    console.error("Erro ao enviar a nota:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/gradeIn", async (req, res) => {
  console.log("Entrei em Gradein")
  try {
    const idtoken = res.locals.token;
    const { grade: score } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: "Nota inválida" });
    }

    const gradeObj = {
      userId: idtoken.user,
      scoreGiven: score,
      scoreMaximum: 100,
      activityProgress: "InProgress",
      gradingProgress: "FullyGraded",
    };

    const lineItemId = idtoken.platformContext.endpoint.lineitem;

    const ltik = res.locals.ltik;
    const user = await Aluno.findOne({ where: { ltik: ltik } });

    if (!user) {
      console.log("Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userModulo = await UsuarioModulo.findOne({
      where: { ltiUserId: user.ltiUserId, ativo: true },
    });

    if (!userModulo) {
      console.log("Módulo ativo não encontrado");
      return res.status(404).json({ error: "Módulo ativo não encontrado" });
    }

    await userModulo.update({ nota: score });

    const responseGrade = await lti.Grade.submitScore(idtoken, lineItemId, gradeObj);
    return res.json(responseGrade);

  } catch (err) {
    console.error("Erro ao enviar a nota:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/api/liberar", async (req,res) =>{
  console.log("Entrei no liberar")
  try {
    console.log(req.body)
    const id_topico = req.body.idTopico
    const user = await Aluno.findOne({where: {ltik: req.body.token}})
    if (user) {
      const userTopico = await UsuarioTopico.findOne({where: {ltiUserId: user.ltiUserId,id_topico: id_topico}})
      if (userTopico) {
        userTopico.update({encerrado: 1})
        res.status(200).json(userTopico)
      }else{
        res.status(404).json("Usuario cadastrado no modulo não encontrado")
      }
    }else{
      console.log("Usuario não encontrado")
    }
  } catch (error) {
    console.log("Erro: ", error)
  }
})
// Função para obter informações do usuário
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

    const modulo = await Modulo.findOne({ where: { id: userModulo.id_modulo } });
    if (!modulo) {
      return res.status(404).json({ error: "Módulo não encontrado" });
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

    const userTopico = await UsuarioTopico.findAll({ where: { ltiUserId: user.ltiUserId } });

    return res.json({ user, modulo, userModulo, topicos, userTopico });

  } catch (err) {
    console.error("Erro ao obter informações do usuário:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
