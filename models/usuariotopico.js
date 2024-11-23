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
    }, {
      tableName: 'UsuarioTopico',
      timestamps: false,
    });
    return UsuarioTopico;
  };
  