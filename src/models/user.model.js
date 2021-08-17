const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const { env, jwtSecret, jwtExpirationInterval } = require('../config/constants');
const logger = require('../config/logger');
const APIError = require('../utils/APIError');
/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        region: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
    });

    /**
     * hash changed password before save
     */
    User.beforeSave(async(user, options) => {
        try {
            if (!user.changed('password')) { return; }
            const rounds = env === 'test' ? 1 : 10;
            const hashedPassword = await bcrypt.hash(user.password, rounds);
            user.password = hashedPassword;
        } catch (error) {
            logger.error(`User beforeSave hook error: ${error}`);
        }
    });

    /**
     * Transform User to the plain safe object
     */
    User.prototype.transform = function() {
        const transformed = {};
        const fields = ['id', 'name', 'surname', 'email', 'role', 'phone', 'country', 'region', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    };
    /**
     * Returns jwtToken
     */
    User.prototype.token = function() {
        const payload = {
            exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment().unix(),
            sub: this.id,
        };
        return jwt.encode(payload, jwtSecret);
    };

    User.prototype.passwordMatches = async function(password) {
        return bcrypt.compare(password, this.password);
    };

    User.getRoles = () => roles;

    /**
     * Get user
     *
     * @param {ObjectId} id - The id of user.
     * @returns {<User, APIError>}
     */
    User.get = async(id) => {
        try {
            let user;
            user = await User.findByPk(id);
            if (user) {
                return user;
            }

            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Checks whether email is already exists
     *
     * @param   {error} error        create database record error
     * @returns {<User, APIError>}
     */
    User.raiseError = (error) => {
        const apiError = new APIError({
            message: error ? error.parent ? error.parent.detail : error : '',
            status: httpStatus.BAD_REQUEST,
            stack: undefined,
        });
        return apiError;
    };

    /**
     * Checks whether email is already exists
     *
     * @param   {options} options    filter options
     * @returns {[Users]}
     */
    User.list = async(options) => {
        const list = await User.findAll();
        return list;
    };


    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    User.findAndGenerateToken = async(options) => {
        const { email, password, refreshObject } = options;
        if (!email) {
            throw new APIError({ message: 'An email is required to generate a token' });
        }

        const user = await User.findOne({
            where: {
                email: email
            },
        });
        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return { user, accessToken: user.token() };
            }
            err.message = 'Incorrect email or password';
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new APIError(err);
    };

    User.associate = models => {
        User.hasMany(models.Notification);
        User.hasMany(models.PortfolioItem);
        User.hasMany(models.PortfolioDetail);
        User.hasMany(models.PortfolioMovement);
    };

    return User;
};