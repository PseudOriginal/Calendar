const jwt = require('express-jwt');
const { secret } = require('../config.json');
const db = require('../_helpers/db');

module.exports = function authorize() {
    return [
        // Authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256']}),
        // Attach full user record to request object
        async(req, res, next) => {
            // Get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.sub);

            // Check user still exists
            if (!user) 
                return res.status(401).json({message: 'Unauthorized'});

            // Authorization successful
            req.user = user.get();
            next();
        }
    ]
}