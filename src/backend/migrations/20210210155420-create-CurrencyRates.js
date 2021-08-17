'use strict';
//Example:
//sequelize migration:generate --name create-ModelName
//sequelize-cli db:migrate
//sequelize-cli db:migrate:undo:all


module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('CurrencyRates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            CurrencyId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            rate: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false
            },
            nominal: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        }).then(() => queryInterface.addConstraint('CurrencyRates', {
            fields: ['CurrencyId'],
            type: 'FOREIGN KEY',
            name: 'FK_currency_rates_currency',
            references: {
                table: 'Currencies',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('CurrencyRates', 'FK_currency_rates_currency')
            .then(() => queryInterface.dropTable('CurrencyRates'));
    }
};