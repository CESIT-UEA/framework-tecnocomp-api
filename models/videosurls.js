module.exports = (sequelize, DataTypes) => {
    const VideoUrls = sequelize.define('VideoUrls', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_topico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: 'VideoUrls',
      timestamps: false,
    });
    return VideoUrls;
  };
  