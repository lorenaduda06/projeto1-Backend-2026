const db = require("../config/db_sequelize");

module.exports = {
    // Formulário de criação
    async getCreate(req, res) {
        res.render("categoria/categoriaCreate");
    },

    // Salvar nova categoria
    async postCreate(req, res) {
        db.Categoria.create(req.body).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todas categorias
    async getList(req, res) {
        db.Categoria.findAll().then(categorias => {
            res.render("categoria/categoriaList", {
                categorias: categorias.map(ctg => ctg.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Editar categoria
    async getUpdate(req, res) {
        await db.Categoria.findByPk(req.params.id).then(ctg => {
            res.render("categoria/categoriaUpdate", {
                categoria: ctg.dataValues
            })
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar edição
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

    // Deletar categoria
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