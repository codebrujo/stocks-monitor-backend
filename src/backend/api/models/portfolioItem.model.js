/**
 * PortfolioItem Schema, static and instance methods
 */
module.exports = (sequelize, DataTypes) => {
    const PortfolioItem = sequelize.define('PortfolioItem', {
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
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    PortfolioItem.addItem = async(payload, user, refItem) => {
        let newModel;
        const { PortfolioMovement } = PortfolioItem.sequelize.models;
        const { multiplier } = refItem;
        const precision = (refItem.price.toString().includes('.')) ? (refItem.price.toString().split('.').pop().length) : (2);
        try {
            const { purchaseDate } = payload;
            const demultipliedPrice = payload.price / multiplier;
            newModel = await sequelize.transaction(async(t) => {
                let portfolioItem = await PortfolioItem.findOne({
                    where: {
                        StockId: refItem.id,
                        UserId: user.id,
                    },
                    transaction: t
                });
                if (!portfolioItem) {
                    portfolioItem = await PortfolioItem.create({
                        UserId: user.id,
                        StockId: refItem.id,
                        purchaseDate: purchaseDate,
                        price: demultipliedPrice,
                        quantity: payload.quantity,
                    }, { transaction: t });
                } else {
                    const initialquantity = portfolioItem.quantity;
                    portfolioItem.quantity = payload.quantity + portfolioItem.quantity;
                    portfolioItem.price = +((demultipliedPrice * payload.quantity + portfolioItem.price * initialquantity) / (portfolioItem.quantity)).toFixed(precision);
                    portfolioItem.purchaseDate = purchaseDate;
                    await portfolioItem.save({ transaction: t });
                }

                // step 2
                await PortfolioMovement.create({
                    UserId: user.id,
                    StockId: refItem.id,
                    movementDate: purchaseDate,
                    quantity: payload.quantity,
                    sum: payload.price * payload.quantity,
                }, { transaction: t });
                return portfolioItem;
            });
        } catch (err) {
            console.log(err);
        }
        return newModel;
    };

    PortfolioItem.getTotalInitialValue = async(user) => {
        const { Stock } = PortfolioItem.sequelize.models;
        const { Sequelize } = PortfolioItem.sequelize;
        let res = await PortfolioItem.findOne({
            attributes: [
                'UserId', [Sequelize.fn('SUM', Sequelize.literal('"PortfolioItem".quantity*"PortfolioItem".price*"Stock".multiplier')), 'total']
            ],
            group: ['UserId'],
            where: {
                UserId: user.id,
            },
            include: [{
                attributes: [],
                model: Stock,
                required: true,
            }],
        });
        return res.dataValues.total ? parseFloat(res.dataValues.total) : 0;
    };

    PortfolioItem.getTotalValue = async(user) => {
        const { Stock } = PortfolioItem.sequelize.models;
        const { Sequelize } = PortfolioItem.sequelize;
        let res = await PortfolioItem.findOne({
            attributes: [
                'UserId', [Sequelize.fn('SUM', Sequelize.literal('"PortfolioItem".quantity*"Stock".price*"Stock".multiplier')), 'total']
            ],
            group: ['UserId'],
            where: {
                UserId: user.id,
            },
            include: [{
                attributes: [],
                model: Stock,
                required: true,
            }],

        });
        return res.dataValues.total ? parseFloat(res.dataValues.total) : 0;
    };

    PortfolioItem.decreaseItem = async(payload, user, refItem) => {
        const { PortfolioMovement } = PortfolioItem.sequelize.models;
        let toWithdraw = payload.quantity;
        const resBody = {
            result: 'success',
            message: '',
            request: payload
        };
        try {
            // Result is whatever you returned inside the transaction
            newModel = await sequelize.transaction(async(t) => {
                let portfolioItem = await PortfolioItem.findOne({
                    where: {
                        StockId: refItem.id,
                        UserId: user.id,
                    },
                    transaction: t
                });
                if (portfolioItem) {
                    const boh = portfolioItem.quantity;
                    if (payload.quantity >= portfolioItem.quantity) {
                        portfolioItem.destroy({ transaction: t });
                        toWithdraw = boh;
                        resBody.message = 'Portfolio item deleted';
                    } else {
                        portfolioItem.quantity = portfolioItem.quantity - payload.quantity;
                        await portfolioItem.save({ transaction: t });
                        resBody.message = `${refItem.ticker} quantity decreased. New value is ${portfolioItem.quantity}`;
                    }
                    const recordToCreate = {
                        UserId: user.id,
                        StockId: refItem.id,
                        movementDate: Date(),
                        quantity: -toWithdraw,
                        sum: -(payload.price * toWithdraw),
                    };
                    // step 2
                    await PortfolioMovement.create(recordToCreate, { transaction: t });
                } else {
                    resBody.result = 'NOT FOUND';
                    resBody.message = 'Nothing done. Item was not found in portfolio.';
                }
                return resBody;
            });
        } catch (err) {
            resBody.result = 'error';
            resBody.message = toString(err);
        }
        return resBody;
    };

    PortfolioItem.associate = models => {
        PortfolioItem.belongsTo(models.Stock);
        PortfolioItem.belongsTo(models.User);
    };

    return PortfolioItem;
};