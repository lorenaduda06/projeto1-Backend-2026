const express = require("express");
const route = express.Router();

const controllerAluno = require("../controller/controllerAluno");
const controllerReceita = require("../controller/controllerReceita");
const controllerCategoria = require("../controller/controllerCategoria");
const controllerHabilidade = require("../controller/controllerHabilidade");

const db = require("../config/db");

// OBS: Essas linhas abaixo criam/recriam as tabelas no banco
// Devem ser descomentadas conforme necessário

// 1) Recria todas as tabelas
/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Tabelas criadas com sucesso!");
});
*/

// 2) Cria o admin e um aluno de teste pelo Postman

module.exports = route;

//  ======== Rotas públicas (não exigem login) ========

// Página inicial - login
route.get("/", controllerAluno.getLogin);

// Página filtrada por categoria
route.get("/public", controllerReceita.getPagInicial);
route.get("/public/categoria/:id", controllerReceita.getPagInicialPorCat);

// Tela de login
route.get("/login", controllerAluno.getLogin);
route.post("/login", controllerAluno.postLogin);

//  ======== Rotas autenticadas (exige login) ========

// Página principal, após login
route.get("/home", (req, res) => res.render("home"));

// Logout
route.get("/logout", controllerAluno.getLogout);

//  ======== Alunos (CRUD completo - apenas para admin) ========
route.get("/alunoCreate", controllerAluno.getCreate);
route.post("/alunoCreate", controllerAluno.postCreate);

route.get("/alunoList", controllerAluno.getList);

route.get("/alunoUpdate/:id", controllerAluno.getUpdate);
route.post("/alunoUpdate", controllerAluno.postUpdate);

route.get("/alunoDelete/:id", controllerAluno.getDelete);

//  ======== Habilidades (referentes ao aluno logado) ========

// Visualizar e adicionar habilidades (exige aluno estar logado)
route.get("/alunoHabilidades", controllerAluno.getHabilidades);
route.post("/alunoHabilidades", controllerAluno.postHabilidade);

// Remover alguma habilidade (exige aluno estar logado)
route.get("/alunoHabilidadeDelete/:habilidade_id", controllerAluno.deleteHabilidade);

//  ======== Receitas ========
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate", controllerReceita.postCreate);

route.get("/receitaList", controllerReceita.getList);

route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", controllerReceita.postUpdate);

route.get("/receitaDelete/:id", controllerReceita.getDelete);

//  ======== Categorias (CRUD - apenas para admin) ========
route.get("/categoriaCreate", controllerCategoria.getCreate);
route.post("/categoriaCreate", controllerCategoria.postCreate);

route.get("/categoriaList", controllerCategoria.getList);

route.get("/categoriaUpdate/:id", controllerCategoria.getUpdate);
route.post("/categoriaUpdate", controllerCategoria.postUpdate);

route.get("/categoriaDelete/:id", controllerCategoria.getDelete);

//  ======== Habilidades (CRUD - apenas para admin) ========
route.get("/habilidadeCreate", controllerHabilidade.getCreate);
route.post("/habilidadeCreate", controllerHabilidade.postCreate);

route.get("/habilidadeList", controllerHabilidade.getList);

route.get("/habilidadeUpdate/:id", controllerHabilidade.getUpdate);
route.post("/habilidadeUpdate", controllerHabilidade.postUpdate);

route.get("/habilidadeDelete/:id", controllerHabilidade.getDelete);