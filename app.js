const express = require("express");
const handlebars = require("express-handlebars");
const session = require("express-session");
const middlewares = require("./middlewares/middlewares");
const routes = require("./routers/route");

const server = express();

// Configuração do handlebars
server.engine("handlebars", handlebars.engine({
    defaultLayout: "main"
}));
server.set("view engine", "handlebars");

// Arquivos estáticos
server.use(express.static("public"));

// Leitura de dados de formulários
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Configuração de sessão
server.use(session({
    secret: "receitasPortfolio",
    cookie: { maxAge: 30 * 60 * 1000 }
}));

// Middlewares para log e controle de sessão
server.use(middlewares.logRegister, middlewares.sessionControl);

// Rotas
server.use(routes);

server.listen(8083, () => {
    console.log("Servidor rodando na porta 8083")
});