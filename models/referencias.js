module.exports = (sequelize, DataTypes) => {
    const Referencias = sequelize.define('Referencias', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_topico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      caminhoDaImagem: {
        type: DataTypes.STRING,
      },
      referencia: {
        type: DataTypes.TEXT,
      },
    }, {
      tableName: 'Referencias',
      timestamps: false,
    });
    return Referencias;
  };
  