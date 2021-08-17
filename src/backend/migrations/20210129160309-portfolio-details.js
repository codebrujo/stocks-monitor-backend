'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('PortfolioDetails', {
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
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            label: {
                type: Sequelize.STRING,
                allowNull: false
            },
            value: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false
            },
        }).then(() => queryInterface.addConstraint('PortfolioDetails', {
            fields: ['UserId'],
            type: 'FOREIGN KEY',
            name: 'FK_portfolio_detail_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('PortfolioDetails', 'FK_portfolio_detail_user')
            .then(() => queryInterface.dropTable('PortfolioDetails'));
    }
};