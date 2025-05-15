module.exports = (sequelize, DataTypes) => {
    const UsuarioTopico = sequelize.define('UsuarioTopico', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_aluno: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_topico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nota: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      encerrado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resposta_errada: {
        type: DataTypes.TEXT,
      },
      indice_video:{
        type: DataTypes.INTEGER
      },
      isTextoApoio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSaibaMais: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isReferencias: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resposta_aberta_aluno: {
        type: DataTypes.TEXT,
      },
      resposta_aberta_nota_IA: {
        type: DataTypes.INTEGER,
      },
      resposta_aberta_justificativa_IA: {
        type: DataTypes.TEXT,
      },
      resposta_aberta_teto: {
        type: DataTypes.INTEGER,
      }
    }, {
      tableName: 'UsuarioTopico',
      timestamps: false,
    });
    return UsuarioTopico;
  };
  