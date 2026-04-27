module.exports = (sequelize, Sequelize) => {
    const AlunoHabilidade = sequelize.define("aluno_habilidade", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        aluno_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        habilidade_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        nivel: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 10
            }
        }
    });

    return AlunoHabilidade;
}