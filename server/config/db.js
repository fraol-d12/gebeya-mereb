const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gebeya_mereb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
