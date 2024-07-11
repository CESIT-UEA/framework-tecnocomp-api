module.exports = (sequelize, DataTypes) => {
    const UsuarioTopico = sequelize.define('UsuarioTopico', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ltiUserId: {
        type: DataTypes.STRING,
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
      }
    }, {
      tableName: 'UsuarioTopico',
      timestamps: false,
    });
    return UsuarioTopico;
  };
  