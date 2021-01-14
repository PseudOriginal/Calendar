const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const { Op } = require("sequelize");
const icalparser = require("ical");
const icalgen = require("ical-generator");
const fs = require("fs");

module.exports = {
  createEvent,
  getEvents,
  modifyEvent,
  deleteEvent,
  importEvents,
  exportEvents,
};

async function createEvent(
  { startDate, endDate, title, notify, description },
  email
) {
  let event = new db.Event({
    startDate: startDate,
    endDate: endDate,
    title: title,
    notify: notify,
    description: description,
    email: email,
  });

  if ((event = await event.save())) {
    const dailyPostman = require("../emails/emails.js");
    dailyPostman.addDailyMail(event, email);
    return event;
  }
  return null;
}

async function getEvents({ startDate, endDate }, email, checkNotify) {
  if (!checkNotify) {
    const events = await db.Event.findAll({
      where: {
        email: email,
        startDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return events;
  } else {
    const events = await db.Event.findAll({
      where: {
        email: email,
        notify: true,
        startDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return events;
  }
}

async function modifyEvent(
  { id, startDate, endDate, title, description, notify },
  email
) {
  let event = await db.Event.findOne({
    where: {
      id: id,
      email: email,
    },
  });

  event.startDate = startDate;
  event.endDate = endDate;
  event.title = title;
  event.notify = notify;
  event.description = description;

  if (await event.save()) {
    const dailyPostman = require("../emails/emails.js");
    dailyPostman.modifyDailyMail(event, email);
    return event;
  }
  return null;
}

async function deleteEvent({ id }, email) {
  let event = await db.Event.findOne({
    where: {
      id: id,
      email: email,
    },
  });

  if (await event.destroy()) return event;
  return null;
}

async function importEvents(file, email) {
  if (!file) {
    console.log("File not found");
    return null;
  }
  const rawdata = Buffer.from(file.buffer, "binary").toString();
  const data = icalparser.parseICS(rawdata);
  var importedEvents = [];
  for (let item in data) {
    if (data.hasOwnProperty(item)) {
      var icalevent = data[item];
      if (icalevent.type == "VEVENT") {
        var newEvent = {
          startDate: icalevent.start,
          endDate: icalevent.end,
          title: icalevent.summary,
          description: icalevent.description,
        };
        importedEvents.push(await createEvent(newEvent, email));
      }
    }
  }
  return importedEvents;
}

async function exportEvents(email) {
  const events = await db.Event.findAll({
    where: {
      email: email,
    },
  });
  var calendarFile = icalgen({
    domain: "calendarefrei.herokuapp.com",
    name: "C@lender",
  });
  for (let i in events) {
    var event = events[i];
    calendarFile.createEvent({
      start: event.startDate,
      end: event.endDate,
      summary: event.title,
      description: event.description,
    });
  }

  return calendarFile;
}
