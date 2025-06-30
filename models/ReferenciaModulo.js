module.exports = (sequelize, DataTypes) => {
  const ReferenciaModulo = sequelize.define(
    "ReferenciaModulo",
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
      link: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "ReferenciasModulo",
      timestamps: false,
    }
  );

  return ReferenciaModulo;
};
