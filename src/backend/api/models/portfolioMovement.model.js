/**
 * PortfolioMovement Schema, static and instance methods
 */
module.exports = (sequelize, DataTypes) => {
    const PortfolioMovement = sequelize.define('PortfolioMovement', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        StockId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        movementDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sum: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
    });

    /**
     * Возвращает общую сумму прибыли (убытка) по портфелю
     *
     * @param {Object} User             Пользователь портфеля
     * @return {Number}                 Сумма прибыли или убытка
     */
    PortfolioMovement.getTotalGains = async(user) => {
        const { Sequelize } = PortfolioMovement.sequelize;
        let res = await PortfolioMovement.findOne({
            attributes: [
                'UserId', [Sequelize.fn('SUM', Sequelize.col('sum')), 'gains']
            ],
            group: ['UserId'],
            where: {
                UserId: user.id,
            },
        });
        return res.dataValues.gains ? -parseFloat(res.dataValues.gains) : 0;
    };

    PortfolioMovement.associate = models => {
        PortfolioMovement.belongsTo(models.Stock);
        PortfolioMovement.belongsTo(models.User);
    };

    return PortfolioMovement;
};