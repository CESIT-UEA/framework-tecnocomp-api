module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define(
    "Aluno",
    {
      id_aluno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ltiUserId: {
        type: DataTypes.STRING,
      },
      nome: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      ltik: {
        type: DataTypes.TEXT,
      },
      id_plataforma: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "Alunos",
      timestamps: false,
    }
  );
  return Aluno;
};
