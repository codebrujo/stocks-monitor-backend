'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        queryInterface.changeColumn('StockDetails', 'volume', {
            type: Sequelize.BIGINT,
            allowNull: false
        });
    },

    down: async(queryInterface, Sequelize) => {
        queryInterface.changeColumn('StockDetails', 'volume', {
            type: Sequelize.INT,
            allowNull: false
        });
    }
};