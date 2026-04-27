module.exports = (sequelize, Sequelize) => {
    const Habilidade = sequelize.define("habilidade", {
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
    });

    return Habilidade;
}