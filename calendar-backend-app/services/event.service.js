const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { Op } = require("sequelize");
const icalparser = require('ical');
const icalgen = require('ical-generator');
const fs = require("fs");

module.exports = {
    createEvent,
    getEvents,
    modifyEvent,
    deleteEvent,
    importEvents,
    exportEvents
}

async function createEvent({ startDate, endDate, title, description }, email) {
    let event = new db.Event({startDate: startDate, endDate: endDate, title: title, description: description, email: email});

    if(event = await event.save())
        return event;
    return null;
}

async function getEvents({ startDate, endDate}, email) {
    const events = await db.Event.findAll({
        where:{
            email: email,
            startDate:{
                [Op.between]: [startDate, endDate]
            }
        }
    });

    return events;
}

async function modifyEvent({ id, startDate, endDate, title, description }, email) {
    let event = await db.Event.findOne({
        where: {
            id: id,
            email: email
        } 
    });

    event.startDate = startDate;
    event.endDate = endDate;
    event.title = title;
    event.description = description;
    
    if (await event.save())
        return event;
    return null;
}

async function deleteEvent({ id }, email) {
    let event = await db.Event.findOne({
        where: {
            id: id,
            email: email
        } 
    });

    if(await event.destroy())
        return true;
    return false;
}

async function importEvents(file, email) {
    if(!file)
    {
        console.log("File not found")
        return null;
    }
    const data = icalparser.parseFile(file.path);
    console.log(data);
    var importedEvents = [];
    for (let item in data) {
        if (data.hasOwnProperty(item)) {
            var icalevent = data[item];
            if (icalevent.type == 'VEVENT') {
                var newEvent = {
					startDate: icalevent.start,
					endDate: icalevent.end,
					title: icalevent.summary,
					description: icalevent.description
                }
                importedEvents.push(await createEvent(newEvent, email));
            }
        }
    }
    console.log(importedEvents);
    return importedEvents;
}

async function exportEvents(email) {
    const events = await db.Event.findAll({
        where:{
            email: email
        }
    });
    calendarFile = icalgen({domain:'unlien', name:'C@lender'});
    for(let i in events)
    {
        var event = events[i];
        calendarFile.createEvent({
            start: event.startDate,
            end: event.endDate,
            summary: event.title,
            description: event.description
        })
    }
    var filepath = __dirname + "\\storage\\calendar.ics";
    calendarFile.saveSync(filepath)

    return filepath;
}