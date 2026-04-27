/*
Caelayne Aparecida Ribeiro Soares – RA:2766957;
Giovanna Furlan Fernandes – RA: 2706385;
Lorena Eduarda Barros Martinelli – RA: 2767104
*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize("receitasweb_db", "postgres", "dbpessoa123", {
    host: "localhost",
    dialect: "postgres"
});

let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Aluno = require("../models/relational/aluno.js")(sequelize, Sequelize);

db.Receita = require("../models/relational/receita.js")(sequelize, Sequelize);

db.Categoria = require("../models/relational/categoria.js")(sequelize, Sequelize);

db.Habilidade = require("../models/relational/habilidade.js")(sequelize, Sequelize);

db.Habilidade = require("../models/relational/alunoHabilidade.js")(sequelize, Sequelize);

// Relacionamentos entre tabelas (ainda não foram criadas oficialmente)
// Seguindo modelo das aulas:

// 1) N:N Aluno e Habilidade
db.Aluno.belongsToMany(db.Habilidade, {
    through: db.AlunoHabilidade,
    foreignKey: "aluno_id"
});

db.Habilidade.belongsToMany(db.Aluno, {
    through: db.AlunoHabilidade,
    foreignKey: "habilidade_id"
});

// 2) N:N Receita e Categoria
db.Receita.belongsToMany(db.Categoria, {
    through: "receita_categorias",
    foreignKey: "receita_id"
});

db.Categoria.belongsToMany(db.Receita, {
    through: "receita_categorias",
    foreignKey: "categoria_id"
});

// 3) N:N Aluno e Receita
db.Receita.belongsToMany(db.Aluno, {
    through: "receita_alunos",
    foreignKey: "receita_id"
});

db.Aluno.belongsToMany(db.Receita, {
    through: "receita_alunos",
    foreignKey: "aluno_id"
});

module.exports = db;