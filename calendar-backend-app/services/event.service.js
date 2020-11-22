const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    create
}

async function create({ start_date, end_date, title, description, email }) {
    let event = new db.Event({start_date: start_date, end_date: end_date, title: title, description: description, email: email});

    if(event = await event.save())
        return event;
    return null;
}