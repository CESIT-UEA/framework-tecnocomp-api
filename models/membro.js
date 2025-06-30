module.exports = (sequelize, DataTypes) => {
  const Membro = sequelize.define(
    "Membro",
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
      cargo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      foto_url: {
        type: DataTypes.TEXT,
      },
      equipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Equipes",
          key: "id",
        },
      },
    },
    {
      tableName: "Membros",
      timestamps: false,
    }
  );

  return Membro;
};
