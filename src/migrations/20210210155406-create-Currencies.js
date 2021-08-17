'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.createTable('Currencies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            charCode: {
                type: Sequelize.STRING,
                allowNull: false
            },
            numCode: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(1024),
                allowNull: false
            },
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('Currencies', {
            fields: ['charCode'],
            type: 'unique',
            name: 'UNIQUE_currency_charCode',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('Currencies', 'UNIQUE_currency_charCode')
            .then(() => queryInterface.dropTable('Currencies'));
    }
};