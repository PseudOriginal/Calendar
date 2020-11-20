const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');

const router = express.Router();
//router.post('/login', loginSchema, loginService);

module.exports = router;

/*exemple :
function loginSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function loginService(req, res, next) {
    userService.login(req.body)
        .then(user => res.json(user))
        .catch(next);
}
*/