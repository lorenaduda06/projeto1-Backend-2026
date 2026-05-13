const Comentario = require("../models/noSql/comentario");

module.exports = {
    async getCreate(req, res) {
        const receita_id = req.params.receita_id;
        res.render("comentario/comentarioCreate", { receita_id });
    },

    async postCreate(req, res) {
        new Comentario({
            titulo: req.body.titulo,
            texto: req.body.texto,
            autor: req.session.login,
            receita_id: req.body.receita_id
        }).save().then(() => {
            res.redirect("/home");
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    },

    async getList(req, res) {
        const receita_id = req.params.receita_id;

        await Comentario.find({ receita_id }).then(comentarios => {
            res.render("comentario/comentarioList", {
                comentarios: comentarios.map(c => c.toJSON()),
                receita_id: receita_id
            });
        }).catch((error) => {
            console.log("Erro: ", error);
        });
    }
}