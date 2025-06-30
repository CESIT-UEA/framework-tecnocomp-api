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
  PlataformaRegistro,
  ReferenciaModulo,
  Vantagem,
  Membro,
  FichaTecnica,
  Equipe,
} = require("../models");
const { where, Op, fn, col } = require("sequelize");

const lti = require("ltijs").Provider;

async function getDadosUser(ltik) {
  try {
    const user = await Aluno.findOne({ where: { ltik } });
    if (!user) throw new Error("Usuário não encontrado");

    const plataforma = await PlataformaRegistro.findOne({
      where: { id: user.id_plataforma },
    });
    if (!plataforma) throw new Error("Plataforma não encontrada");

    const userModulo = await UsuarioModulo.findOne({
      where: { id_aluno: user.id_aluno, ativo: true },
    });
    if (!userModulo) throw new Error("Módulo ativo não encontrado");

    const modulo = await Modulo.findByPk(userModulo.id_modulo, {
      include: [
        {
          model: Topico,
          include: [
            {
              model: VideoUrls,
              include: [
                {
                  model: UsuarioVideo,
                  where: { id_aluno: user.id_aluno },
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
        },
        {
          model: Vantagem,
        },
        {
          model: ReferenciaModulo,
        },
        {
          model: UsuarioModulo,
          where: {
            comentario: { [Op.ne]: null },
          },
          attributes: ["comentario", "avaliacao", "id_aluno", "id_modulo"],
          limit: 3,
          order: [["id", "DESC"]],
          required: false,
        },
        {
          model: FichaTecnica,
          include: [
            { model: Equipe, as: "Equipes", include: [{ model: Membro }] },
          ],
        },
      ],
    });

    if (!modulo) throw new Error("Módulo não encontrado");

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

    const mediaAvaliacao = await UsuarioModulo.findOne({
      attributes: [
        [fn("AVG", col("avaliacao")), "media"],
        [fn("COUNT", col("avaliacao")), "quantidade_avaliacoes"],
      ],
      where: {
        id_modulo: modulo.id,
        avaliacao: { [Op.not]: null },
      },
      raw: true,
    });

    const dados_user = {
      user,
      userModulo,
      modulo,
      plataforma,
      topicos: modulo.Topicos,
      userTopico,
      vantagens_modulo: modulo.Vantagems || [],
      referencias_modulo: modulo.ReferenciaModulos || [],
      mediaAvaliacoes: parseFloat(mediaAvaliacao?.media || 0),
      quantidadeAvaliacoes: parseInt(
        mediaAvaliacao?.quantidade_avaliacoes || 0
      ),
      comentarios_recentes: modulo.UsuarioModulos || [],
      ficha_tecnica: modulo.FichaTecnica || [],
    };

    return dados_user;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

module.exports = { getDadosUser };
