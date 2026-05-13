module.exports = (sequelize, Sequelize) => {
    const Receita = sequelize.define("receita", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },

        descricao: {
            type: Sequelize.STRING,
            allowNull: false
        },

        link_externo: {
            type: Sequelize.STRING,
            allowNull: true
        },

        imagem: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Receita;
}