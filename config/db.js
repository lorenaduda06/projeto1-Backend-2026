/*
Caelayne Aparecida Ribeiro Soares – RA:2766957;
Giovanna Furlan Fernandes – RA: 2706385;
Lorena Eduarda Barros Martinelli – RA: 2767104
*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize("aluno_db", "postgres", "dbpessoa123", {
    host: "localhost",
    dialect: "postgres"
});

let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Aluno = require("../models/aluno.js")(sequelize, Sequelize);

db.Receita = require("../models/receita.js")(sequelize, Sequelize);

db.Categoria = require("../models/categoria.js")(sequelize, Sequelize);

db.Habilidade = require("../models/habilidades.js")(sequelize, Sequelize);

// Relacionamentos entre tabelas (ainda não foram criadas oficialmente)

// 1) N:N Aluno e Habilidade

// 2) N:N Receita e Categoria

// 3) N:N Aluno e Receita

module.exports = db;