module.exports = (sequelize, DataTypes) => {
  const PlataformaRegistro = sequelize.define(
    "PlataformaRegistro",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      plataformaUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plataformaNome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idCliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
      temaTipo: {
        type: DataTypes.ENUM("padrao", "tema1", "tema2", "customizado"),
        defaultValue: "padrao",
      },
      customPrimaria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customSecundaria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customTerciaria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customQuartenaria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customQuintenaria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "plataformaRegistro",
      timestamps: false,
    }
  );
  return PlataformaRegistro;
};
