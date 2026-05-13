const mongoose = require("mongoose");
const db_mongoose = require("../../config/db_mongoose");

mongoose.connect(db_mongoose.connection).then(() => {
    console.log("Conexão com o MongoDB efetuada com sucesso!");
}).catch((error) => {
    console.log("Erro na conexão com o MongoDB");
});

const comentarioSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    texto: { type: String, required: true },
    autor: { type: String, required: true },
    receita_id: { type: Number, required: true }
});

module.exports = mongoose.model("Comentario", comentarioSchema);