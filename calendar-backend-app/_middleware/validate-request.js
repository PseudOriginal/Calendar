module.exports = function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false,  // abort after the last validation error
        allowUnknown: true, // ignore unknown keys
        stripUnknown: true // remove unknown keys from the validated data
    }

    const { error, value } = schema.validate(req.body, options);
    
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}