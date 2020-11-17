const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const userService = require('../services/user.service');

const router = express.Router();
router.post('/login', loginSchema, loginService);
router.post('/register', registerSchema, registerService);
router.get('/', authorize(), getUserService)

module.exports = router;

function loginSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

// generic route handler
const genericHandler = (req, res, next) => {
    res.json({
        status: 'success',
        data: req.body
    });
};

function loginService(req, res, next) {
    userService.login(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerService(req, res, next) {
    userService.register(req.body)
        .then(() => res.json({message: 'Registration successful'}))
        .catch(next);
}

function getUserService(req, res, next) {
    res.json(req.user);
}