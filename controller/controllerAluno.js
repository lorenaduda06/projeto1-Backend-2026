// Importação da configuração do banco de dados
const db = require("../config/db");

module.exports = {
    // Logout do sistema
    async getLogout(req, res) {
        req.session.destroy();  // Destrói todos os dados da sessão
        res.redirect("/");      // Redireciona para a tela de login
    },

    // Mostra formulário de login
    async getLogin(req, res) {
        res.render("login", { layout: "noMenu" });
    },

    // Processamento os dados enviados pelo formulário de login
    async postLogin(req, res) {
        // Busca no banco um alino com o email e senha informados
        db.Aluno.findAll({
            where: {
                email: req.body.email,
                senha: req.body.senha
            }
        }).then(alunos => {
            if (alunos.length > 0) {
                // Informações salvas na sessão, sessão fica salva no servidor
                req.session.login = req.body.email;
                req.session.aluno_id = alunos[0].dataValues.id;
                req.session.tipo = alunos[0].dataValues.tipo;

                // Informações salvas em res.locals, que disponibiliza variáveis para todas as views
                res.locals.login = req.body.email;

                if (alunos[0].dataValues.tipo == 1) {
                    res.locals.admin = true;
                }

                // Redireciona para a página inicial após o login
                res.redirect("/home");
            }
            else {
                // Se não encontrou, volta para o login
                res.redirect("/");
            }
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // CRUD de alunos (apenas para admin)

    // Formulário para criar novo aluno
    async getCreate(req, res) {
        res.render("aluno/alunoCreate");
    },

    // Salvar novo aluno no banco de dados
    async postCreate(req, res) {
        db.Aluno.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            tipo: req.body.tipo         // 0 -> aluno comum; 1 -> admin
        }).then(() => {
            res.redirect("/home");      //Após salvar, volta para "home"
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todos alunos cadastrados
    async getList(req, res) {
        // findAll é equivalente a SELECT * FROM alunos
        db.Aluno.findAll().then(alunos => {
            res.render("aluno/alunoList", {
                // map() converte cada aluno para formato JSON (para handlebars entender)
                alunos: alunos.map(aluno => aluno.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Buscar aluno específico para editar
    async getUpdate(req, res) {
        await db.Aluno.findByPk(req.params.id).then(aluno => {
            res.render("aluno/alunoUpdate", {
                aluno: aluno.dataValues         // Dados do aluno para preencher o formulário
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar alterações de aluno que foi editado
    async postUpdate(req, res) {
        await db.Aluno.update(req.body, {
            where: {
                id: req.body.id     // Identifica qual aluno editar
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Deletar um aluno do banco de dados
    async getDelete(req, res) {
        // destroy() é equivalente a DELETE FROM aluno id ...
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

    // Exibe as habilidades que o aluno já possui e as disponíveis para adicionar
    async getHabilidades(req, res) {
        // Busca todas as habilidades disponíveis no sistema
        let todas_hab = await db.Habilidade.findAll();

        // Busca o aluno com suas habilidades
        let aluno = await db.Aluno.findByPk(req.session.aluno_id, {
            include: [{
                model: db.Habilidade, as: "Habilidades"       // Inclui as habilidades relacionadas a este aluno
            }]
        });

        res.render("aluno/alunoHabilidades", {
            // Todas as habilidades disponíveis
            habilidades: todas_hab.map(hab => hab.toJSON()),

            // Habilidades que o aluno já tem (com nível)
            my_hab: aluno.Habilidades.map(hab => ({
                id: hab.toJSON().id,
                nome: hab.toJSON().nome,
                nivel: hab.AlunoHabilidade.nivel
            }))
        });
    },

    // Adicionar habilidade ao aluno (com nível de 0 a 10)
    async postHabilidade(req, res) {
        const nivel = parseInt(req.body.nivel);

        //Validação: nível deve estar entre 0-10
        if (nivel < 0 || nivel > 10) {
            console.log("O nível deve estar entre 0-10");
            return res.redirect("/home");
        }

        await db.AlunoHabilidade.create({
            aluno_id: req.session.aluno_id,         // Aluno deve estar logado
            habilidade_id: req.body.habilidade_id,  // Habilidade selecionada
            nivel: req.body.nivel                   // Nível informado
        }).then(() => {
            res.redirect("/home")
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Remover habilidade do aluno
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
    },

    // Relatório público

    // Proporção de alunos por habilidade
    async getRelat(req, res) {
        // Quantidade de alunos comuns cadastrados no banco de dados
        let todos_alunos = await db.Aluno.count({ where: { tipo: 0 } });

        db.Habilidade.findAll({
            include: [{
                model: db.Aluno, as: "Alunos", atributes: []

                // CONFERIR ESSA MUDANÇA
                //model: db.AlunoHabilidade,
                //attributes: ["nivel"]
            }]
        }).then(habilidades => {
            // Calcula para cada habilidade a proproção de alunos relacionados a ela
            let relat = habilidades.map(hab => {
                let dados_aluno_hab = hab.toJSON();
                
                // Quantidade de alunos que têm essa habilidade
                let qt = dados_aluno_hab.AlunoHabilidade ? dados_aluno_hab.AlunoHabilidade.length : 0;
                let distribuicao_por_hab = todos_alunos > 0 ? ((qt / todos_alunos) * 100).toFixed(1) : 0;   // toFixed(1) deixa 1 casa após a vírgula

                return {
                    nome: dados_aluno_hab.nome,
                    qt: qt,
                    distribuicao_por_hab: distribuicao_por_hab
                }
            });

            // O relatório é renderizado com página pública (sem login)
            res.render("public/relatorioHabilidades", 
                { relatorio: relat },
                { layout: "noMenu" }
            );
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    }
}