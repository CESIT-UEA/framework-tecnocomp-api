module.exports = (sequelize, DataTypes) => {
    const Alternativas = sequelize.define('Alternativas', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_exercicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
      },
      explicacao: {
        type: DataTypes.TEXT,
      },
      correta: {
        type: DataTypes.BOOLEAN,
      },
    }, {
      tableName: 'Alternativas',
      timestamps: false,
    });
    return Alternativas;
  };
  