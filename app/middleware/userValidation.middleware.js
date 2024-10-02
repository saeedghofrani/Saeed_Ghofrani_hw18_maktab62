// validation function
const { usernameValidation, firstNameValidation, lastNameValidation, passwordValidation, phoneValidation, emailValidation, genderValidation } = require('../utils/validation.utils');
const createError = require('http-errors');
// wraper for diffrent senarios
const wraper = (mod) => {
    return userValidation = async (req, res, next) => {
        try {
            res.locals = { error: false, message: [] };
            // create validation
            if (mod === 'create') {
                //username validation
                usernameValidation(req, res);
                //first name validation
                firstNameValidation(req, res);
                //last name validation
                lastNameValidation(req, res);
                //password validation
                passwordValidation(req, res);
                //phone validation
                phoneValidation(req, res);
                next();
            }
            //update validation
            if (mod === 'update') {
                //username validation
                usernameValidation(req, res);
                //first name validation
                firstNameValidation(req, res);
                //last name validation
                lastNameValidation(req, res);
                //phone validation
                phoneValidation(req, res);
                //email validation
                emailValidation(req, res);
                //gender validation
                genderValidation(req, res);
                next();
            }
            //update password validation
            if (mod === 'pass') {
                passwordValidation(req, res);
                next();
            }
        } catch (error) {
            next(createError(500));
        }
    };
}

module.exports = wraper;