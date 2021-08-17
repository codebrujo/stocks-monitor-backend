/* eslint-disable no-undef */
/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
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
        highPrice: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
        lowPrice: {
            type: DataTypes.DECIMAL(18, 6),
            allowNull: false
        },
    });

    Notification.findByTicker = async(ticker, user) => {
        const { Stock } = Notification.sequelize.models;
        const { eq } = Notification.sequelize.Sequelize.Op;
        const item = await Notification.findOne({
                attributes: [
                    'id', 'highPrice', 'lowPrice'
                ],
                where: {
                    UserId: {
                        [eq]: user.id
                    }
                },
                include: [{
                    attributes: [
                        'ticker'
                    ],
                    where: {
                        ticker: {
                            [eq]: ticker
                        }
                    },
                    model: Stock,
                    required: true,
                }, ],
            })
            .catch((e) => {
                logger.error(e);
                return null;
            });
        return item;
    };

    Notification.addItem = async(payload, user, refItem) => {
        const { highPrice, lowPrice } = payload;
        const [newModel, created] = await Notification.findOrCreate({
            where: {
                StockId: refItem.id,
                UserId: user.id,
            },
            defaults: {
                UserId: user.id,
                StockId: refItem.id,
                highPrice,
                lowPrice,
            }
        });
        if (!created) {
            newModel.highPrice = highPrice;
            newModel.lowPrice = lowPrice;
            await newModel.save();
        }
        return newModel;
    };

    Notification.deleteItem = async(notificationId) => {
        item = await Notification.findOne({
            where: {
                id: notificationId,
            }
        });
        if (item) {
            item.destroy();
        }
    };

    Notification.associate = models => {
        Notification.belongsTo(models.Stock);
        Notification.belongsTo(models.User);
    };

    return Notification;
};