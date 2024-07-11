module.exports = (sequelize, DataTypes) => {
  const Modulo = sequelize.define(
    "Modulo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome_modulo: {
        type: DataTypes.STRING,
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
