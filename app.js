// Importação do express -> para criar servidor web
const express = require("express");

// Express-Handlebars: template engine para renderizar páginas dinâmicas
const handlebars = require("express-handlebars");

// Express-Session: gerencia sessões de usuário, mantendo o usuário logado entre diferentes requisições
const session = require("express-session");

// Middlewares personalizados
const middlewares = require("./middlewares/middlewares");

// Rotas do sistema: define quais URLs chamam quais controllers
const routes = require("./routers/route");

const server = express();

// Configuração do handlebars

// engine: configura o motor de template (handlebars)
server.engine("handlebars", handlebars.engine({
    defaultLayout: "main"
}));

// set: define qual extensão de arquivo será usada para as views
server.set("view engine", "handlebars");

// Arquivos estáticos
// express.static indica uma pasta pública que será servida automaticamente
server.use(express.static("public"));

// Leitura de dados de formulários
// express.urlencoded(): processa dados enviados por formulários HTML tradicionais
// extended: true permite dados aninhados (objetos dentro de objetos)
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Configuração de sessão
server.use(session({
    secret: "receitasPortfolio",        // secret: string secreta usada para assinar o cookie da sessão (impede falsificação)
    cookie: { maxAge: 30 * 60 * 1000 }  // maxAge: tempo de vida do cookie em milissegundos
}));

// Middlewares para log e controle de sessão
// server.use() aplica o middleware para TODAS as rotas do sistema
server.use(middlewares.logRegister, middlewares.sessionControl);

// Rotas
server.use(routes);

server.listen(8083, () => {
    console.log("Servidor rodando na porta 8083")
});