module.exports = (sequelize, DataTypes) => {
  const Exercicios = sequelize.define(
    "Exercicios",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_topico: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questao: {
        type: DataTypes.TEXT,
      },
      aberta: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      criterios: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Exercicios",
      timestamps: false,
    }
  );
  return Exercicios;
};
