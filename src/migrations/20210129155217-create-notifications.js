'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.createTable('Notifications', {
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
            highPrice: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false
            },
            lowPrice: {
                type: Sequelize.DECIMAL(18, 6),
                allowNull: false
            },
            updatedAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
        }).then(() => queryInterface.addConstraint('Notifications', {
            fields: ['StockId'],
            type: 'FOREIGN KEY',
            name: 'FK_notification_stock',
            references: {
                table: 'Stocks',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        })).then(() => queryInterface.addConstraint('Notifications', {
            fields: ['UserId'],
            type: 'FOREIGN KEY',
            name: 'FK_notification_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'no action',
        }));
    },
    down: async(queryInterface, Sequelize) => {
        queryInterface.removeConstraint('Notifications', 'FK_notification_stock')
            .then(() => queryInterface.removeConstraint('Notifications', 'FK_notification_user'))
            .then(() => queryInterface.dropTable('Notifications'));
    }
};