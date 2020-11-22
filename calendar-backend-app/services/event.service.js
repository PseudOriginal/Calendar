const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const { Op } = require("sequelize");

module.exports = {
    create,
    getEvents
}

async function create({ start_date, end_date, title, description }, email) {
    let event = new db.Event({start_date: start_date, end_date: end_date, title: title, description: description, email: email});

    if(event = await event.save())
        return event;
    return null;
}

async function getEvents({ start_date, end_date}, email) {
    const events = db.Event.findAll({
        where:{
            email: email,
            start_date:{
                [Op.between]: [start_date, end_date]
            }
        }
    });

    return events;
}