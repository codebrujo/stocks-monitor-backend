const httpStatus = require('http-status');
const db = require('../models');
const moment = require('moment');
const { jwtExpirationInterval } = require('../../config/constants');
const { omit } = require('lodash');

const { User, RefreshToken } = db;

/**
 * Returns a formated object with tokens
 * @private
 */
const generateTokenResponse = async(user, accessToken) => {
    const tokenType = 'Bearer';
    const refreshToken = (await RefreshToken.generate(user)).token;
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    };
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async(req, res, next) => {
    try {
        const userData = omit(req.body, 'role');
        userData.role = 'user';
        const user = await new User(userData).save();
        const userTransformed = user.transform();
        const token = await generateTokenResponse(user, user.token());
        res.status(httpStatus.CREATED);
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(User.raiseError(error));
    }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async(req, res, next) => {
    try {
        const { user, accessToken } = await User.findAndGenerateToken(req.body);
        const token = await generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(error);
    }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async(req, res, next) => {
    try {
        const { email, refreshToken } = req.body;
        const refreshObject = await RefreshToken.findOne({
            userEmail: email,
            token: refreshToken,
        });

        const { user, accessToken } = (await User.findAndGenerateToken({ email, refreshObject }));
        const response = await generateTokenResponse(user, accessToken);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};