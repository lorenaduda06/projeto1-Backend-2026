module.exports = (sequelize, Sequelize) => {
    const AlunoHabilidade = sequelize.define("aluno_habilidade", {
        aluno_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        habilidade_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
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