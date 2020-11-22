const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const eventService = require('../services/event.service');

const router = express.Router();
router.post('/create', authorize(), createSchema, createService);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        title : Joi.string().required(),
        description : Joi.string().allow(''),
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function createService(req, res, next) {
    eventService.create(req.body)
        .then(event => res.json(event))
        .catch(next);
}