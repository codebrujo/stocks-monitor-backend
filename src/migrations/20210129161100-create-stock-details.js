'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('StockDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      StockId: {
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
      openValue: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },
      maxValue: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },
      minValue: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },
      closeValue: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },
      volume: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      value: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },

    }).then(() => queryInterface.addConstraint('StockDetails', {
      fields: ['StockId'],
      type: 'FOREIGN KEY',
      name: 'FK_stock_detail_stock',
      references: {
        table: 'Stocks',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'no action',
    }));
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('StockDetails', 'FK_stock_detail_stock')
      .then(() => queryInterface.dropTable('StockDetails'));
  }
};