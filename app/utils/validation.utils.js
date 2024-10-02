const validator = require('validator');
const { Error } = require('mongoose');
const { MongoError } = require('mongodb');
const usernameValidation = async (req, res) => {
    let { username } = req.body;
    username = username.trim();
    if (!username || validator.isEmpty(username) || username.length < 5) {
        res.locals.error = true;
        res.locals.message.push('invalid username: username most be more than 5 letter and UNIQUE!!');
    }
};
const firstNameValidation = (req, res) => {
    let { firstName } = req.body;
    firstName = firstName.trim();
    if (!firstName || validator.isEmpty(firstName)) {
        res.locals.error = true;
        res.locals.message.push('invalid firstname: firstname is required!!');
    }
};
const lastNameValidation = (req, res) => {
    let { lastName } = req.body;
    lastName = lastName.trim();
    if (!lastName || validator.isEmpty(lastName)) {
        res.locals.error = true;
        res.locals.message.push('invalid lastname: lastname is required!!');
    }
};
const passwordValidation = (req, res) => {
    let { password } = req.body;
    password = password.trim();
    const reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!password || validator.isEmpty(password) || !reg.test(password) || password.length < 8) {
        res.locals.error = true;
        res.locals.message.push('password most be more than 8 character (uppercase letter, number, lowercase letter, special character(!@#$&) )!!');
    }
};
const phoneValidation = async (req, res) => {
    let { phone } = req.body;
    phone = phone.trim();
    if (!phone || validator.isEmpty(phone) || !validator.isMobilePhone(phone, ['fa-IR'])) {
        res.locals.error = true;
        res.locals.message.push('invalid phone: phone is required!!');
    }
};
const emailValidation = async (req, res) => {
    let { email } = req.body;
    email = email.trim();
    if (!email || validator.isEmpty(email) || !validator.isEmail(email)) {
        res.locals.error = true;
        res.locals.message.push('invalid email: email is required!!');
    }
};
const genderValidation = async (req, res) => {
    let type = ['male', 'female', 'none'];
    if (!type.includes(req.body.gender)) {
        res.locals.error = true;
        res.locals.message.push('invalid email: email is required!!');
    }
};
const handler = (res, err, page) => {
    if (err instanceof Error.ValidationError) {
        return res.render(`${page}`, { ERROR: err });
    }
    if (err instanceof MongoError) {
        return res.render(`${page}`, { ERROR: err });
    }
    // err.status = err.status || 500;
    // return res.status(err.status).send({ success: false, message: err.message });
};
module.exports = { usernameValidation, firstNameValidation, lastNameValidation, passwordValidation, phoneValidation, emailValidation, handler, genderValidation };