'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('PortfolioItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            StockId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            purchaseDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            price: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('PortfolioItems', {
            fields: ['StockId'],
            type: 'FOREIGN KEY',
            name: 'FK_portfolio_item_stock',
            references: {
                table: 'Stocks',
                field: 'id',
            },
            onDelete: 'no action',
            onUpdate: 'no action',
        })).then(() => queryInterface.addConstraint('PortfolioItems', {
            fields: ['UserId'],
            type: 'FOREIGN KEY',
            name: 'FK_portfolio_item_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('PortfolioItems', 'FK_portfolio_item_stock')
            .then(() => queryInterface.removeConstraint('PortfolioItems', 'FK_portfolio_item_user'))
            .then(() => queryInterface.dropTable('PortfolioItems'));
    }
};