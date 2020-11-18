const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    //login
}

/*example :
async function login({ email, password }) {
    const user = await db.User.scope('withHashPassword').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Email and/or password is incorrect!!';
    
        // Authentication successful
        const token = jwt.sign({ sub: user.email }, config.secret, { expiresIn: '2h' });
        return { ...omitHash(user.get()), token };
}
*/