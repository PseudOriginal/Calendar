const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { Op } = require("sequelize");

module.exports = {
    createEvent,
    getEvents,
    modifyEvent,
    deleteEvent
}

async function createEvent({ startDate, endDate, title, notify, description }, email) {
    let event = new db.Event({startDate: startDate, endDate: endDate, title: title, notify: notify, description: description, email: email});

    if(event = await event.save()) {
        const dailyPostman = require('../emails/emails.js')
        dailyPostman.addDailyMail(event, email)
        return event;
    }
    return null;
}

async function getEvents({ startDate, endDate}, email, checkNotify) {
    if (!checkNotify) {
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
    else {
        const events = await db.Event.findAll({
            where:{
                email: email,
                notify: true,
                startDate:{
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        return events;
    }
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
    event.notify = notify;
    event.description = description;
    
    if (await event.save()) {
        const dailyPostman = require('../emails/emails.js')
        dailyPostman.modifyDailyMail(event, email)
        return event;
    }
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