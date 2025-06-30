module.exports = (sequelize, DataTypes) => {
  const Vantagem = sequelize.define(
    "Vantagem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      modulo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Modulos',
          key: 'id',
        },
      },
    },
    {
      tableName: "Vantagens",
      timestamps: false,
    }
  );

  return Vantagem;
};
