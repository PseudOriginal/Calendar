const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const eventService = require('../services/event.service');

const router = express.Router();
router.post('/createEvent', authorize(), createEventSchema, createEventService);
router.get('/getEvents', authorize(), getEventsSchema, getEventsService);
router.post('/modifyEvent', authorize(), modifyEventSchema, modifyEventService);
router.post('/deleteEvent', authorize(), deleteEventSchema, deleteEventService);

module.exports = router;

function createEventSchema(req, res, next) {
    const schema = Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        title : Joi.string().required(),
        description : Joi.string().allow('')
    });
    validateRequest(req, next, schema);
}

function getEventsSchema(req, res, next) {
    const schema = Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().required()
    });
    validateRequest(req, next, schema);
}

function modifyEventSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        title : Joi.string().required(),
        description : Joi.string().allow('')
    });
    validateRequest(req, next, schema);
}

function deleteEventSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function createEventService(req, res, next) {
    eventService.createEvent(req.body, req.user.email)
        .then(event => res.json(event))
        .catch(next);
}

function getEventsService(req, res, next) {
    eventService.getEvents(req.body, req.user.email)
        .then(events => res.json(events))
        .catch(next);
}

function modifyEventService(req, res, next) {
    eventService.modifyEvent(req.body, req.user.email)
        .then(event => res.json(event))
        .catch(next);
}

function deleteEventService(req, res, next) {
    eventService.deleteEvent(req.body, req.user.email)
        .then(deleted => res.json(deleted))
        .catch(next);
}