module.exports = (sequelize, DataTypes) => {
  const Equipe = sequelize.define(
    "Equipe",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ficha_tecnica_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FichasTecnicas",
          key: "id",
        },
      },
    },
    {
      tableName: "Equipes",
      timestamps: false,
    }
  );

  return Equipe;
};
