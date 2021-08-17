const { Joi } = require('express-validation');

module.exports = {

    // POST /v1/users
    createUser: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6).max(128),
            name: Joi.string().max(255).required(),
            surname: Joi.string().max(255).required(),
            phone: Joi.string().required(),
            country: Joi.string().required(),
            region: Joi.string().required(),
            role: Joi.string(),
        }),
    },

    // DELETE /v1/users/:userId
    deleteUser: {
        body: Joi.object({
            password: Joi.string().min(6).max(128).required(),
        }),
        params: Joi.object({
            userId: Joi.string().regex(/^[0-9]*$/).required(),
        }),
    },

    // PATCH /v1/users/:userId
    updateUser: {
        body: Joi.object({
            oldPassword: Joi.string(),
            password: Joi.string().min(0),
            name: Joi.string().max(255),
            surname: Joi.string().max(255),
            phone: Joi.string(),
            country: Joi.string(),
            region: Joi.string(),
            role: Joi.string(),
        }),
        params: Joi.object({
            userId: Joi.string().regex(/^[0-9]*$/).required(),
        }),
    },
};