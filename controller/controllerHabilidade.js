const db = require("../config/db_sequelize");

module.exports = {
    // Formulário de criação
    async getCreate(req, res) {
        res.render("habilidade/habilidadeCreate");
    },

     // Salvar nova habilidade
    async postCreate(req, res) {
        db.Habilidade.create(req.body).then(() => {
            res.redirect("/habilidadeList");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todas habilidades
    async getList(req, res) {
        db.Habilidade.findAll().then(habilidades => {
            res.render("habilidade/habilidadeList", {
                habilidades: habilidades.map(hab => hab.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Editar habilidade
    async getUpdate(req, res) {
        await db.Habilidade.findByPk(req.params.id).then(habilidade => {
            res.render("habilidade/habilidadeUpdate", {
                habilidade: habilidade.dataValues
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar edição
    async postUpdate(req, res) {
        await db.Habilidade.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Deletar habilidade
    async getDelete(req, res) {
        await db.Habilidade.destroy({
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