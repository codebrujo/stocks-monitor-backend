const crypto = require('crypto');
const { result } = require('lodash');
const moment = require('moment');
/**
 * RefreshToken Schema
 */
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires: {
            type: DataTypes.DATE,
        },
    });

    /**
     * Generate a refresh token object and saves it into the database
     *
     * @param {User} user
     * @returns {RefreshToken}
     */
    RefreshToken.generate = async(user) => {
        const token = `${user.id}.${crypto.randomBytes(40).toString('hex')}`;
        const expires = moment().add(30, 'days').toDate();

        const [tokenObject, created] = await RefreshToken.findOrCreate({
            where: {
                UserId: user.id,
            },
            defaults: {
                token,
                UserId: user.id,
                userEmail: user.email,
                expires,
            }
        });
        if (!created) {
            tokenObject.token = token;
            tokenObject.expires = expires;
            await tokenObject.save();
        }
        return tokenObject;
    };

    /**
     * Generate a refresh token object and saves it into the database
     *
     * @param {User} user
     * @returns {RefreshToken}
     */
    RefreshToken.findOneAndRemove = async(payload) => {
        const { userEmail, token } = payload;
        let dataValues = {};
        const obj = await RefreshToken.findOne({
            where: {
                userEmail,
                token,
            }
        });
        console.log('findOneAndRemove1', obj);
        if (obj) {
            dataValues = obj['dataValues'];
            obj.destroy();
        }
        return dataValues;
    };

    RefreshToken.associate = models => {
        RefreshToken.belongsTo(models.User);
    };

    return RefreshToken;
};