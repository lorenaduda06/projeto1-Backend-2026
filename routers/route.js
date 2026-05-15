const express = require("express");
const route = express.Router();

// Instalação e configuração do multer
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const controllerAluno = require("../controllers/controllerAluno");
const controllerReceita = require("../controllers/controllerReceita");
const controllerCategoria = require("../controllers/controllerCategoria");
const controllerHabilidade = require("../controllers/controllerHabilidade");
const controllerComentario = require("../controllers/controllerComentario");

const db = require("../config/db");

// OBS: Essas linhas abaixo criam/recriam as tabelas no banco
// Devem ser descomentadas conforme necessário

// 1) Recria todas as tabelas: deve ser descomentada primeiro para rodar o servidor
/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Tabelas criadas com sucesso!");
});
*/

// Depois de criar as tabelas, pare a execução, comente a criação de tabelas (acima) e descomente o código para criar o administrador

// 2) Cria o admin
db.Aluno.create({ nome: "Administrador", email: "admin@gmail.com", senha: "1234", tipo: 1 });

module.exports = route;

//  ======== Rotas públicas (não exigem login) ========

// Página inicial - lista todas as receitas
route.get("/", controllerReceita.getPagInicial);

// Página pública com todas as receitas
route.get("/receitas", controllerReceita.getPagInicial);

// Página filtrada por categoria
route.get("/public/categoria/:id", controllerReceita.getPagInicialPorCat);

// Relatório de habilidades
route.get("/public/relatorioHabilidades", controllerAluno.getRelat);

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

// Atualizar alguma habilidade (exige aluno estar logado)
route.post("/alunoHabilidadeUpdate/:id", controllerAluno.updateHabilidade);

// Remover alguma habilidade (exige aluno estar logado)
route.get("/alunoHabilidadeDelete/:habilidade_id", controllerAluno.deleteHabilidade);

//  ======== Receitas (CRUD - exige aluno estar logado) ========
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate", upload.single("imagem"), controllerReceita.postCreate);

route.get("/receitaList", controllerReceita.getList);

route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", upload.single("imagem"), controllerReceita.postUpdate);

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

//  ======== Comentários (CRUD - exige aluno estar logado) ========
route.get("/comentarioCreate/:receita_id", controllerComentario.getCreate);

route.post("/comentarioCreate", controllerComentario.postCreate);

route.get("/comentarioList/:receita_id", controllerComentario.getList);