const db = require("../config/db");

module.exports = {
    // Logout do sistema
    async getLogout(req, res) {
        req.session.destroy();
        res.redirect("/");
    },

    // Mostra tela de login
    async getLogin(req, res) {
        res.render("login", { layout: "noMenu" });
    },

    // Processamento do login
    async postLogin(req, res) {
        db.Aluno.findAll({
            where: {
                email: req.body.email,
                senha: req.body.senha
            }
        }).then(alunos => {
            if (alunos.length > 0) {
                // Informações salvas na sessão
                req.session.login = req.body.email;
                req.session.aluno_id = alunos[0].dataValues.id;

                req.session.tipo = alunos[0].dataValues.tipo;

                // Informações disponíveis em 'views'
                res.locals.login = req.body.email;

                if (alunos[0].dataValues.tipo == 1) {
                    res.locals.admin = true;
                }

                res.redirect("/home");
            }
            else {
                res.redirect("/");
            }
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // CRUD de alunos (apenas para admin)

    // Formulário de criação
    async getCreate(req, res) {
        res.render("aluno/alunoCreate");
    },

    // Salvar novo aluno
    async postCreate(req, res) {
        db.Aluno.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            tipo: req.body.tipo
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todos alunos
    async getList(req, res) {
        db.Aluno.findAll().then(alunos => {
            res.render("aluno/alunoList", {
                alunos: alunos.map(aluno => aluno.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Buscar aluno para editar
    async getUpdate(req, res) {
        await db.Aluno.findByPk(req.params.id).then(aluno => {
            res.render("aluno/alunoUpdate", {
                aluno: aluno.dataValues
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar edição
    async postUpdate(req, res) {
        await db.Aluno.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Deletar aluno
    async getDelete(req, res) {
        await db.Aluno.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Habilidades do aluno
    async getHabilidades(req, res) {
        // Busca todas as habilidades disponíveis
        let todas_hab = await db.Habilidade.findAll();

        // Busca o aluno com suas habilidades
        let aluno = await db.Aluno.findByPk(req.session.aluno_id, {
            include: [{
                model: db.Habilidade
            }]
        });

        res.render("aluno/alunoHabilidades", {
            // Todas as habilidades disponíveis
            habilidades: todas_hab.map(hab => hab.toJSON()),

            // Habilidades que o aluno já tem (com nível)
            my_hab: aluno.habilidades.map(hab => ({
                id: hab.toJSON().id,
                nome: hab.toJSON().nome,
                nivel: hab.AlunoHabilidade.nivel
            }))
        });
    },

    // Adicionar habilidade ao aluno
    async postHabilidade(req, res) {
        const nivel = parseInt(req.body.nivel);
        if (nivel < 0 || nivel > 10) {
            console.log("O nível deve estar entre 0-10");
            return res.redirect("/home");
        }

        await db.AlunoHabilidade.create({
            aluno_id: req.session.aluno_id,
            habilidade_id: req.body.habilidade_id,
            nivel: req.body.nivel
        }).then(() => {
            res.redirect("/home")
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Remover habilidade do aluno (ver se precisa)
    async deleteHabilidade(req, res) {
        await db.AlunoHabilidade.destroy({
            where: {
                aluno_id: req.session.aluno_id,
                habilidade_id: req.params.habilidade_id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    }
}