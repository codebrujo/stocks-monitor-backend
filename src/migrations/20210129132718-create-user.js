'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            surname: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            role: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            country: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            region: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('Users', {
            fields: ['email'],
            type: 'unique',
            name: 'UNIQUE_user_email',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('Users', 'UNIQUE_user_email')
            .then(() => queryInterface.dropTable('Users'));
    }
};