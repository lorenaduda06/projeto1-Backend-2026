// Importação da configuração do banco de dados
const db = require("../config/db");

module.exports = {
    // CRUD de categorias (apenas admin pode acessar)

    // Formulário para criar nova categoria
    async getCreate(req, res) {
        res.render("categoria/categoriaCreate");
    },

    // Salvar nova categoria no banco de dados
    async postCreate(req, res) {
        db.Categoria.create(req.body).then(() => {
            res.redirect("/home");          // Redreciona para home após salvar
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todas categorias cadastradas
    async getList(req, res) {
        db.Categoria.findAll().then(categorias => {
            res.render("categoria/categoriaList", {
                categorias: categorias.map(ctg => ctg.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Busca uma categoria específica para editar
    async getUpdate(req, res) {
        await db.Categoria.findByPk(req.params.id).then(ctg => {
            res.render("categoria/categoriaUpdate", {
                categoria: ctg.dataValues
            })
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar alterações de uma categoria
    async postUpdate(req, res) {
        await db.Categoria.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Deletar categoria do banco de dados
    async getDelete(req, res) {
        await db.Categoria.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    }
}