//USER MODEL
const User = require('../model/user.model');
// check username and phone for duplicate data in database
const duplicate = {
    //check in update dashboard procces
    dashboard: async (req, res, next) => {
        if (req.session.user.username !== req.body.username && await User.findOne({ username: req.body.username })) {
            return res.status(400).send({ success: false, message: 'Username already taken' });
        }
        if (req.session.user.phone !== req.body.phone && await User.findOne({ phone: req.body.phone })) {
            return res.status(400).send({ success: false, message: 'Phone number already taken' });
        }
        next();
    },
    //check in register procces
    register: async (req, res, next) => {
        if (await User.findOne({ username: req.body.username })) {
            return res.render('register', { ERROR: "Username already taken" });
        }
        if (await User.findOne({ phone: req.body.phone })) {
            return res.render('register', { ERROR: "Phone number already taken" });
        }
        next();
    },
};
module.exports = duplicate;