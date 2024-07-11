module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define(
    "Aluno",
    {
      ltiUserId: {
        type: DataTypes.STRING,
        primaryKey: true,
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
    },
    {
      tableName: "Alunos",
      timestamps: false,
    }
  );
  return Aluno;
};
