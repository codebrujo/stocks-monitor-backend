const httpStatus = require('http-status');
const { omit } = require('lodash');
const db = require('../../models');
const APIError = require('../../utils/APIError');

const { User } = db;

/**
 * Load user and append to req.
 * @public
 */
exports.load = async(req, res, next, id) => {
    User.findOne({ where: { id } })
        .then((user) => {
            if (!user) {
                const e = new Error('User does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            req.locals = { user };
            return next();
        })
        .catch((e) => next(e));
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());


/**
 * Create new user
 * @public
 */
exports.create = async(req, res, next) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(httpStatus.CREATED);
        res.json(savedUser.transform());
    } catch (error) {
        next(User.raiseError(error));
    }
};

/**
 * Update existing user
 * @public
 */
exports.update = async(req, res, next) => {
    const { user } = req;
    const userToUpdate = req.locals.user;
    const { oldPassword, password } = req.body;
    const ommitFields = user.role !== 'admin' ? ['role'] : [];
    if (password && user.role !== 'admin' && !(await user.passwordMatches(oldPassword))) {
        const e = new APIError({
            message: 'Incorrect initial password. Remove password field or put correct initial password to oldPassword field.',
            status: httpStatus.FORBIDDEN,
        });
        next(e);
        return;
    } else {
        ommitFields.push('password');
    }
    const toAssign = omit(req.body, ommitFields);
    const updatedUserObj = Object.assign(userToUpdate, toAssign);
    updatedUserObj.save()
        .then(savedUser => res.json(savedUser.transform()))
        .catch(e => next(User.raiseError(e)));
};


/**
 * Get user list
 * @public
 */
exports.list = async(req, res, next) => {
    try {
        const users = (await User.list(req.query)).map(user => user.transform());
        res.json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 * @public
 */
exports.remove = async(req, res, next) => {
    const { user } = req;
    const { password } = req.body;
    const userToDelete = req.locals.user;
    if (user.role !== 'admin' && !(await user.passwordMatches(password))) {
        const e = new APIError({
            message: 'Incorrect password',
            status: httpStatus.FORBIDDEN,
        });
        next(e);
    } else {
        userToDelete.destroy()
            .then(() => res.status(httpStatus.NO_CONTENT).end())
            .catch(e => next(e));
    }
};