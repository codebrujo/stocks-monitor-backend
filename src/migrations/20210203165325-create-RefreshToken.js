'use strict';
//sequelize migration:generate --name create-RefreshToken
//sequelize-cli db:migrate
//sequelize-cli db:migrate:undo:all

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('RefreshTokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            userEmail: {
                type: Sequelize.STRING,
                allowNull: false
            },
            expires: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('RefreshTokens', {
            fields: ['UserId'],
            type: 'FOREIGN KEY',
            name: 'FK_tokens_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('RefreshTokens', 'FK_tokens_user')
            .then(() => queryInterface.dropTable('RefreshTokens'));
    }
};