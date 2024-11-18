const {
    Modulo,
    UsuarioModulo,
    Topico,
    UsuarioTopico,
    PlataformaRegistro,
    Aluno,
    VideoUrls,
    UsuarioVideo,
  } = require("../models");
  const {Op} = require("sequelize");

async function createUser(token, ltik, modulo, plataforma) {
  const url_retorno = token.platformContext.launchPresentation.return_url
  const user = await Aluno.create({
    ltiUserId: token.user,
    nome: token.userInfo.name,
    email: token.userInfo.email,
    ltik: ltik,
    id_plataforma: plataforma.id,
    url_retorno : url_retorno
  });

  await UsuarioModulo.create({ id_modulo: modulo.id, id_aluno: user.id_aluno });

  const topicos = await Topico.findAll({ where: { id_modulo: modulo.id } });
  for (let topico of topicos) {
    await UsuarioTopico.create({
      id_aluno: user.id_aluno,
      id_topico: topico.id,
    });

    // Associar vídeos ao aluno
    const videos = await VideoUrls.findAll({ where: { id_topico: topico.id } });
    for (let video of videos) {
      await UsuarioVideo.create({
        id_aluno: user.id_aluno,
        id_video: video.id,
      });
    }
  }
}

async function updateUser(user, ltik, modulo, token) {
  await user.update({ ltik: ltik });
  const url_retorno = token.platformContext.launchPresentation.return_url

  await UsuarioModulo.update(
    { ativo: false },
    { where: { id_aluno: user.id_aluno, id_modulo: { [Op.ne]: modulo.id } } }
  );

  const userModulo = await UsuarioModulo.findOne({
    where: { id_modulo: modulo.id, id_aluno: user.id_aluno },
  });

  if (userModulo) {
    await userModulo.update({ ativo: true, url_retorno: url_retorno });
  } else {
    await UsuarioModulo.create({
      id_modulo: modulo.id,
      id_aluno: user.id_aluno,
    });
  }

  const topicos = await Topico.findAll({ where: { id_modulo: modulo.id } });
  for (let topico of topicos) {
    const userTopico = await UsuarioTopico.findOne({
      where: { id_aluno: user.id_aluno, id_topico: topico.id },
    });

    if (!userTopico) {
      await UsuarioTopico.create({
        id_aluno: user.id_aluno,
        id_topico: topico.id,
      });
    }

    // Associar vídeos ao aluno
    const videos = await VideoUrls.findAll({ where: { id_topico: topico.id } });
    for (let video of videos) {
      const userVideo = await UsuarioVideo.findOne({
        where: { id_aluno: user.id_aluno, id_video: video.id },
      });

      if (!userVideo) {
        await UsuarioVideo.create({
          id_aluno: user.id_aluno,
          id_video: video.id,
        });
      }
    }
  }
}

module.exports = { createUser, updateUser };
