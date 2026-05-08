// Importação da configuração do banco de dados
const db = require("../config/db");

module.exports = {
    // CRUD de receitas (área aluno logado)

    // Formulário para criar nova receita
    async getCreate(req, res) {
        // Busca todas as categorias para preencher o select
        let cat = await db.Categoria.findAll();

        // Busca apenas alunos comuns para vincular à receita
        let alunos = await db.Aluno.findAll({
            where: {
                tipo: 0     // Tipo 0: aluno comum; tipo 1: admin
            }
        });

        res.render("receita/receitaCreate", {
            categorias: cat.map(ctg => ctg.toJSON()),
            alunos: alunos.map(aluno => aluno.toJSON())
        });
    },

    // Salvar nova receita no banco de dados
    async postCreate(req, res) {
        const aluno_id = req.session.aluno_id;      // Aluno logado

        // Tratamento de relacionamentos

        // Garante 'categoria_ids' ser um array 
        let categoria_ids = req.body.categoria_ids || [];
        if (!Array.isArray(categoria_ids)) categoria_ids = [categoria_ids];

        // Garante 'aluno_ids' ser um array 
        let aluno_ids = req.body.aluno_ids || [];
        if (!Array.isArray(aluno_ids)) aluno_ids = [aluno_ids];

        // Adiciona o aluno logado
        if (!aluno_ids.includes(String(aluno_id))) aluno_ids.push(String(aluno_id));

        // Cria a receita
        db.Receita.create({
            nome: req.body.nome,
            descricao: req.body.descricao,
            link_externo: req.body.link_externo
        }).then(async (receita) => {
            // Cria os relacionamentos

            // Associa categorias à receita (cardinalidade: many to many)
            await receita.setCategorias(categoria_ids);

            // Associa alunos à receita (cardinalidade: many to many)
            await receita.setAlunos(aluno_ids);
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todas receitas cadastradas (do aluno logado)
    async getList(req, res) {
        db.Receita.findAll({
            include: [
                { model: db.Aluno, where: { id: req.session.aluno_id }},    // Lista apenas receitas do aluno logado
                { model: db.Categoria }
            ]
        }).then(receitas => {
            res.render("receita/receitaList", {
                receitas: receitas.map(rec => rec.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Busca uma receita específica para editar
    async getUpdate(req, res) {
        // Busca todas categorias para o select
        let cat = await db.Categoria.findAll();

        // Busca apenas alunos comuns
        let alunos = await db.Aluno.findAll({
            where: {
                tipo: 0
            }
        });
        
        await db.Receita.findByPk(req.params.id, {
            include: [
                { model: db.Aluno },
                { model: db.Categoria }
            ]
        }).then(receita => {
            res.render("receita/receitaUpdate", {
                receita: receita.toJSON(),
                categorias: cat.map(ctg => ctg.toJSON()),
                alunos: alunos.map(aluno => aluno.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar alterações de uma receita
    async postUpdate(req, res) {
        let categoria_ids = req.body.categoria_ids || [];
        if (!Array.isArray(categoria_ids)) categoria_ids = [categoria_ids];

        let aluno_ids = req.body.aluno_ids || [];
        if (!Array.isArray(aluno_ids)) aluno_ids = [aluno_ids];

        await db.Receita.update({
            nome: req.body.nome,
            descricao: req.body.descricao,
            link_externo: req.body.link_externo
        }, {
            where: {
                id: req.body.id
            }
        });

        // Atualiza os relacionamentos
        const receita = await db.Receita.findByPk(req.body.id);
        await receita.setCategorias(categoria_ids);             // Remove antigos e adiciona novos
        await receita.setAlunos(aluno_ids);                     // Remove antigos e adiciona novos

        res.redirect("/home");
    },

    // Deletar receita do banco de dados (remove também os relacionamentos)
    async getDelete(req, res) {
        await db.Receita.findByPk(req.params.id, {
            include: [
                { model: db.Aluno }
            ]
        }).then(async(receita) => {
            // Remove todas associações com categorias
            await receita.setCategorias([]);    // Remove todas categorias

            // Remove todas associações com alunos
            await receita.setAlunos([]);        // Remove todos alunos

            // Deleta a receita
            await receita.destroy();            // Exclui a receita
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Página pública (acesso não exige login)

    // Exibe todas as receitas para usuário externo
    async getPagInicial(req, res) {
        // Busca todas categorias (para o filtro)
        let cat = await db.Categoria.findAll();

        // Busca todas receitas com seus dados completos
        db.Receita.findAll({
            include: [
                { model: db.Categoria },
                { model: db.Aluno }
            ]
        }).then(receitas => {
            res.render("publico/receitasPublico", 
            {
                categorias: cat.map(ctg => ctg.toJSON()),
                receitas: receitas.map(rec => rec.toJSON()),
            }, 
            { layout: "noMenu" }
        );
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },


    // Exibe receitas filtradas por categoria
    async getPagInicialPorCat(req, res) {
        let cat = await db.Categoria.findAll();

        // Busca a categoria selecionada pelo usuário
        let cat_escolhida = await db.Categoria.findByPk(req.params.id);

        // Busca apenas receitas da categoria selecionada
        db.Receita.findAll({
            include: [
                { model: db.Categoria, where: {id: req.params.id} },
                { model: db.Aluno }
            ]
        }).then(receitas => {
            res.render("publico/receitasPublico", 
            {
                categorias: cat.map(ctg => ctg.toJSON()),
                cat_selecionada: cat_escolhida ? cat_escolhida.toJSON() : null,
                receitas: receitas.map(rec => rec.toJSON()),
            },
            { layout: "noMenu" }
        );
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    }
}