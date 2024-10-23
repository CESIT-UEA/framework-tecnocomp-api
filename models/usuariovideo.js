module.exports = (sequelize, DataTypes) => {
    const UsuarioVideo = sequelize.define('UsuarioVideo', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ltiUserId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_video: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      completo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }, {
      tableName: 'UsuarioVideo',
      timestamps: false,
    });
    return UsuarioVideo;
  };
  