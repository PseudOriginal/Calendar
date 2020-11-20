const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    login,
    register,
    getUser
}

async function login({ email, password }) {
    const user = await db.User.scope('withHashPassword').findOne({ where: { email } });
    const { secret } = db.config;

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Email and/or password is incorrect!!';
    
        // Authentication successful
        const token = jwt.sign({ sub: user.email }, secret, { expiresIn: '2h' });
        return { ...omitHash(user.get()), token };
}

async function register({ email, password }) {
    // Validate
    if (await db.User.findOne({ where: { email }})) 
        throw `${email} is already taken`;

    // Hash password
    if (password) 
        password = await bcrypt.hash(password, 10);

    // Save user
    await db.User.create({ email, password });
}

async function getUser(email) {
    const user = await db.User.findOne({ where: { email }});
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}