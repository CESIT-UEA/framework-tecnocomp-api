const { Aluno, UsuarioVideo, UsuarioTopico,UsuarioModulo} = require("../models");
const express = require("express");
const router = express.Router();
const gradeService = require("../Services/gradeService");
const userService = require("../Services/userService");
const videosService = require("../Services/videosService");
const { where } = require("sequelize");

router.post("/gradein", async (req, res) => {
  try {
    console.log("Grade in");
    const idtoken = res.locals.token; // IdToken
    if (!idtoken) {
      return res.status(400).send({ error: "Token inválido" });
    }

    const score = req.body.grade; // Nota do usuário
    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({ error: "Nota inválida" });
    }

    const ltik = res.locals.ltik; // Pega o ltik do usuário

    const responseGrade = await gradeService.submitGrade(
      idtoken,
      score,
      ltik,
      "InProgress",
      "FullyGraded"
    );
    console.log(responseGrade);
    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (err) {
    console.log(err);
    console.error("Erro no processo: ", err.message);
    return res.status(500).send({ error: err.message });
  }
});

router.post("/grade", async (req, res) => {
  try {
    const idtoken = res.locals.token; // IdToken
    if (!idtoken) {
      return res.status(400).send({ error: "Token inválido" });
    }

    const score = req.body.grade; // Nota do usuário
    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({ error: "Nota inválida" });
    }

    const ltik = res.locals.ltik; // Pega o ltik do usuário

    const responseGrade = await gradeService.submitGrade(
      idtoken,
      score,
      ltik,
      "Completed",
      "FullyGraded"
    );
    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (err) {
    console.error("Erro no processo: ", err.message);
    return res.status(500).send({ error: err.message });
  }
});

router.post("/api/liberar", async (req, res) => {
  console.log("Entrei no liberar");
  try {
    const id_topico = req.body.idTopico;
    const ltik = req.body.token; // Pega o ltik do usuário
    const dados_user_atualizado = await userService.getDadosUser(ltik);
    const liberar = await videosService.liberarProximoVideo(
      id_topico,
      req.body.token
    );
    console.log(liberar);
    if (liberar) {
      return res.status(200).json(dados_user_atualizado);
    }
  } catch (error) {
    console.log("Erro: ", error);
  }
});
// Função para obter informações do usuário
router.get("/userInfo", async (req, res) => {
  try {
    const ltik = res.locals.ltik;
    let dados_user = await userService.getDadosUser(ltik);
    if (dados_user == null) {
      return res.status(500).json("Erro ao puxar os dados do usuario");
    }

    return res.status(200).json(dados_user);
  } catch (err) {
    console.error("Erro ao obter informações do usuário:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/finalizar-video", async (req, res) => {
  const { ltiUserId, videoId, ltik } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    // Atualizar a entrada na tabela UsuarioVideo, marcando como completo
    await UsuarioVideo.update(
      { completo: true },
      { where: { id_aluno: user.id_aluno, id_video: videoId } }
    );

    // Retorna os dados do usuário atualizados
    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error("Erro ao finalizar vídeo:", error);
    return res.status(500).json({ message: "Erro ao finalizar vídeo" });
  }
});

router.post("/salvar-progresso-video", async (req, res) => {
  const { id_video, ltik, id_topico } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    await UsuarioTopico.update(
      { indice_video: id_video },
      { where: { id_aluno: user.id_aluno, id_topico: id_topico } }
    );

    // Retorna os dados do usuário atualizados
    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error("Erro ao finalizar vídeo:", error);
    return res.status(500).json({ message: "Erro ao finalizar vídeo" });
  }
});

router.post("/resposta-errada", async (req, res) => {
  const { idTopico, ltik, respostaErrada } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    await UsuarioTopico.update(
      { resposta_errada: respostaErrada },
      { where: { id_aluno: user.id_aluno, id_topico: idTopico } }
    );

    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error("Erro ao cadastrar resposta errada:", error);
    return res
      .status(500)
      .json({ message: "Erro ao cadastrar resposta errada" });
  }
});

router.post("/resposta-errada-refazer", async (req, res) => {
  const { idTopico, ltik } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    await UsuarioTopico.update(
      { resposta_errada: null },
      { where: { id_aluno: user.id_aluno, id_topico: idTopico } }
    );

    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error("Erro ao resetar a resposta errada:", error);
    return res
      .status(500)
      .json({ message: "Erro ao resetar a resposta errada" });
  }
});

router.post("/finalizaSaibaMais", async (req, res) => {
  const { idTopico, ltik } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    await UsuarioTopico.update(
      { isSaibaMais: true },
      { where: { id_aluno: user.id_aluno, id_topico: idTopico } }
    );

    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error("Erro ao marcar como visto o saiba mais do topico:", error);
    return res
      .status(500)
      .json({ message: "Erro ao marcar como visto o saiba mais do topico:" });
  }
});

router.post("/finalizaTextoApoio", async (req, res) => {
  const { idTopico, ltik } = req.body;
  console.log(req.body);
  const user = await Aluno.findOne({ where: { ltik } });

  try {
    await UsuarioTopico.update(
      { isTextoApoio: true },
      { where: { id_aluno: user.id_aluno, id_topico: idTopico } }
    );

    const dados_user_atualizado = await userService.getDadosUser(ltik);

    return res.status(200).json(dados_user_atualizado);
  } catch (error) {
    console.error(
      "Erro ao marcar como visto o Texto de apoio do topico:",
      error
    );
    return res.status(500).json({
      message: "Erro ao marcar como visto o Texto de apoio do topico",
    });
  }
});

//! Testar
router.post("/enviar_avaliacao", async (req, res) => {
  const { id_user_modulo, avaliacao, comentario, ltik } = req.body;
  console.log(req.body);

  const user = await UsuarioModulo.findOne({ where: { id : id_user_modulo } });

  try {
    if (user) {
      await UsuarioModulo.update(
        { avaliacao: avaliacao, comentario: comentario },
        { where: { id : id_user_modulo } }
      );
  
      const dados_user_atualizado = await userService.getDadosUser(ltik);
  
      return res.status(200).json(dados_user_atualizado);
    }else{
      return res.json({error:"Falha ao encontrar o UsuarioModulo Id"});
    }

  } catch (error) {
    console.error("Erro ao tentar salvar a nota de avaliação do modulo:", error);
    return res
      .status(500)
      .json({ message: `Erro ao tentar salvar a nota de avaliação do modulo: ${error}`});
  }
});



module.exports = router;
