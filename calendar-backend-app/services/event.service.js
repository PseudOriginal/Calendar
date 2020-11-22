const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { Op } = require("sequelize");

module.exports = {
    create,
    getEvents,
    modifyEvent
}

async function create({ start_date, end_date, title, description }, email) {
    let event = new db.Event({start_date: start_date, end_date: end_date, title: title, description: description, email: email});

    if(event = await event.save())
        return event;
    return null;
}

async function getEvents({ start_date, end_date}, email) {
    const events = await db.Event.findAll({
        where:{
            email: email,
            start_date:{
                [Op.between]: [start_date, end_date]
            }
        }
    });

    return events;
}

async function modifyEvent({ id, start_date, end_date, title, description }, email) {
    let event = await db.Event.findOne({
        where: {
            id: id
        } 
    });

    event.start_date = start_date;
    event.end_date = end_date;
    event.title = title;
    event.description = description;
    event.email = email;
    
    if (await event.save())
        return event;
    return null;
}