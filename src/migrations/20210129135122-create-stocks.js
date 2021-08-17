'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CompanyId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ticker: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      CurrencyId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ratio: {
        type: Sequelize.DECIMAL(6, 1),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(18, 6),
        allowNull: false
      },
      multiplier: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      link: {
        type: Sequelize.STRING(1024),
        allowNull: false
      }
    }).then(() => queryInterface.addConstraint('Stocks', {
      fields: ['CompanyId'],
      type: 'FOREIGN KEY',
      name: 'FK_company_stock',
      references: {
        table: 'Companies',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'no action',
    })).then(() => queryInterface.addConstraint('Stocks', {
      fields: ['CurrencyId'],
      type: 'FOREIGN KEY',
      name: 'FK_currency_stock',
      references: {
        table: 'Currencies',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'no action',
    })).then(() => queryInterface.addConstraint('Stocks', {
      fields: ['ticker'],
      type: 'unique',
      name: 'UNIQUE_stock_ticker',
    }));
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Stocks', 'FK_company_stock')
      .then(() => queryInterface.removeConstraint('Stocks', 'FK_currency_stock'))
      .then(() => queryInterface.removeConstraint('Stocks', 'UNIQUE_stock_ticker'))
      .then(() => queryInterface.dropTable('Stocks'));
  }
};