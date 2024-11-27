module.exports = (sequelize, DataTypes) => {
  const Modulo = sequelize.define(
    "Modulo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome_url: {
        type: DataTypes.TEXT,
      },
      nome_modulo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ebookUrlGeral: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      video_inicial: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "Modulos",
      timestamps: false,
    }
  );
  return Modulo;
};
