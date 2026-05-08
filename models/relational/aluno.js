module.exports = (sequelize, Sequelize) => {
    const Aluno = sequelize.define("aluno", {
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

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        senha: {
            // ver como usar hash
            type: Sequelize.STRING,
            allowNull: false
        },

        tipo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0     // 1 -> admin; 0 -> aluno
        }
    });

    return Aluno;
}