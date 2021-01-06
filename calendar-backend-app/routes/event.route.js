const express = require("express");
const multer = require("multer");
const { diskStorage } = require("multer");
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const eventService = require("../services/event.service");

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 8000000, // Compliant: 8MB
  },
});

const router = express.Router();
router.post("/createEvent", authorize, createEventSchema, createEventService);
router.get("/getEvents", authorize, getEventsSchema, getEventsService);
router.post("/modifyEvent", authorize, modifyEventSchema, modifyEventService);
router.post("/deleteEvent", authorize, deleteEventSchema, deleteEventService);
router.post(
  "/importEvent",
  upload.single("icalfile"),
  authorize,
  importEventService
);
router.get("/exportEvent", authorize, exportEventService);

module.exports = router;

function createEventSchema(req, res, next) {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .required(),
    title: Joi.string().required(),
    notify: Joi.boolean().required(),
    description: Joi.string().allow(""),
  });
  validateRequest(req, next, schema);
}

function getEventsSchema(req, res, next) {
  const schema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .required(),
  });
  const { error, value } = schema.validate(req.query);

  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  } else {
    req.quary = value;
    next();
  }
}

function modifyEventSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date()
      .greater(Joi.ref("startDate"))
      .required(),
    title: Joi.string().required(),
    notify: Joi.boolean().required(),
    description: Joi.string().allow(""),
  });
  validateRequest(req, next, schema);
}

function deleteEventSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function createEventService(req, res, next) {
  eventService
    .createEvent(req.body, req.user.email)
    .then((event) => res.json(event))
    .catch(next);
}

function getEventsService(req, res, next) {
  eventService
    .getEvents(req.query, req.user.email, false)
    .then((events) => res.json(events))
    .catch(next);
}

function modifyEventService(req, res, next) {
  eventService
    .modifyEvent(req.body, req.user.email)
    .then((event) => res.json(event))
    .catch(next);
}

function deleteEventService(req, res, next) {
  eventService
    .deleteEvent(req.body, req.user.email)
    .then((deleted) => res.json(deleted))
    .catch(next);
}

function importEventService(req, res, next) {
  eventService
    .importEvents(req.file, req.user.email)
    .then((importedEvents) => res.json(importedEvents))
    .catch(next);
}

function exportEventService(req, res, next) {
  eventService
    .exportEvents(req.user.email)
    .then((exportFile) => exportFile.serve(res))
    .catch(next);
}
