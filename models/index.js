const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tecnocomp', 'tecnocomp', '0a463635baa5a', {
  host: '172.25.1.5',
  dialect: 'mysql', 
  port:3306
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Modulo = require('./modulo')(sequelize, Sequelize);
db.Topico = require('./topico')(sequelize, Sequelize);
db.VideoUrls = require('./videosurls')(sequelize, Sequelize);
db.SaibaMais = require('./saibamais')(sequelize, Sequelize);
db.Referencias = require('./referencias')(sequelize, Sequelize);
db.Exercicios = require('./exercicios')(sequelize, Sequelize);
db.Alternativas = require('./alternativas')(sequelize, Sequelize);
db.Aluno = require('./aluno')(sequelize, Sequelize);
db.UsuarioModulo = require('./usuariomodulo')(sequelize, Sequelize);
db.UsuarioTopico = require('./usuariotopico')(sequelize, Sequelize);
db.PlataformaRegistro = require('./plataformaRegistro')(sequelize, Sequelize);

// Defina associações
db.Modulo.hasMany(db.Topico, { foreignKey: 'id_modulo' });
db.Topico.belongsTo(db.Modulo, { foreignKey: 'id_modulo' });

db.Topico.hasMany(db.VideoUrls, { foreignKey: 'id_topico' });
db.VideoUrls.belongsTo(db.Topico, { foreignKey: 'id_topico' });

db.Topico.hasMany(db.SaibaMais, { foreignKey: 'id_topico' });
db.SaibaMais.belongsTo(db.Topico, { foreignKey: 'id_topico' });

db.Topico.hasMany(db.Referencias, { foreignKey: 'id_topico' });
db.Referencias.belongsTo(db.Topico, { foreignKey: 'id_topico' });

db.Topico.hasMany(db.Exercicios, { foreignKey: 'id_topico' });
db.Exercicios.belongsTo(db.Topico, { foreignKey: 'id_topico' });

db.Exercicios.hasMany(db.Alternativas, { foreignKey: 'id_exercicio' });
db.Alternativas.belongsTo(db.Exercicios, { foreignKey: 'id_exercicio' });

db.Aluno.hasMany(db.UsuarioModulo, { foreignKey: 'ltiUserId' });
db.UsuarioModulo.belongsTo(db.Aluno, { foreignKey: 'ltiUserId' });

db.Aluno.hasMany(db.UsuarioTopico, { foreignKey: 'ltiUserId' });
db.UsuarioTopico.belongsTo(db.Aluno, { foreignKey: 'ltiUserId' });

db.Topico.hasMany(db.UsuarioTopico, { foreignKey: 'id_topico' });
db.UsuarioTopico.belongsTo(db.Topico, { foreignKey: 'id_topico' });

module.exports = db;
