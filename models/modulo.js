module.exports = (sequelize, DataTypes) => {
  const Modulo = sequelize.define(
    "Modulo",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ebookUrlGeral: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nome_modulo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      video_inicial: {
        type: DataTypes.TEXT,
      },
      nativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      template: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
      uuid: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "Modulos",
      timestamps: false,
    }
  );
  return Modulo;
};
