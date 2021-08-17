'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('PortfolioMovements', {
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
            movementDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            sum: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('PortfolioMovements', {
            fields: ['StockId'],
            type: 'FOREIGN KEY',
            name: 'FK_portfolio_movement_stock',
            references: {
                table: 'Stocks',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        })).then(() => queryInterface.addConstraint('PortfolioMovements', {
            fields: ['UserId'],
            type: 'FOREIGN KEY',
            name: 'FK_portfolio_movement_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('PortfolioMovements', 'FK_portfolio_movement_stock')
            .then(() => queryInterface.removeConstraint('PortfolioMovements', 'FK_portfolio_movement_user'))
            .then(() => queryInterface.dropTable('PortfolioMovements'));
    }
};