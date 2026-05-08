// Importação da configuração do banco de dados
const db = require("../config/db");

module.exports = {
    // CRUD de habilidades (apenas admin pode acessar)

    // Formulário para criar nova habilidade
    async getCreate(req, res) {
        res.render("habilidade/habilidadeCreate");
    },

    // Salvar nova habilidade no banco de dados
    async postCreate(req, res) {
        db.Habilidade.create(req.body).then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Listar todas categorias cadastradas
    async getList(req, res) {
        db.Habilidade.findAll().then(habilidades => {
            res.render("habilidade/habilidadeList", {
                habilidades: habilidades.map(hab => hab.toJSON())
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Busca uma habilidade específica para editar
    async getUpdate(req, res) {
        await db.Habilidade.findByPk(req.params.id).then(habilidade => {
            res.render("habilidade/habilidadeUpdate", {
                habilidade: habilidade.dataValues
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    // Salvar alterações de uma habilidade
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

    // Deletar habilidade do banco de dados
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