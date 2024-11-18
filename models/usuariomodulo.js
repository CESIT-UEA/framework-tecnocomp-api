module.exports = (sequelize, DataTypes) => {
    const UsuarioModulo = sequelize.define('UsuarioModulo', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_aluno: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nota: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      progresso: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      url_retorno : {
        type: DataTypes.TEXT,
      }
    }, {
      tableName: 'UsuarioModulo',
      timestamps: false,
    });
    return UsuarioModulo;
  };
  