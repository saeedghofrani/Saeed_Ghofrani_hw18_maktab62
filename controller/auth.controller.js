// Module dependencies.
const bcrypt = require('bcryptjs');
//user model
const User = require('../model/user.model');
// wrapper contain trycatch for error handling
const safeCall = require('../utils/safeCall.utils');


//render login page
const login = (_request, response, _next) => {
    return response.render('login');
};

//check username and password for access to dashboard
const loginProcess = safeCall(async (request, response, _next) => {
    // get user pass from request
    const { username, password } = request.body;
    // find user by username and get password
    const user = await User.findOne({ username }).select('+password');
    // send error case of wrong username 
    if (!user)
        return response.render('login', {
            ERROR: "wrong username or password"
        });

    //compaire password
    const userPass = await bcrypt.compare(password, user.password);
    // send error case of wrong password
    if (!userPass)
        return response.render('login', {
            ERROR: "wrong username or password"
        });
    //set session for user 
    request.session.user = user;
    //redirect to dashboard route
    return response.redirect('/dashboard');
});

//render Rigester page
const register = (_request, response, _next) => {
    response.render('register');
};

//create acount 
const registerProcess = safeCall(async (request, response, _next) => {
    //validation error handler 
    if (response.locals.error)
        return response.render('register', {
            ERROR: response.locals.message
        });

    // collect data from request body (form)
    const data = {
        username,
        password,
        firstName,
        lastName,
        phone
    } = request.body;

    //create user by collected data
    const user = await User.create(data);
    //error handling for MODEL.CREATE
    if (!user)
        return response.render('register', {
            ERROR: 'creating user was unsuccessful'
        });
    //set session for user
    request.session.user = user;
    //redirect to dashboard
    return response.redirect('/dashboard');
});

//logout controller 
const logout = (request, response, _next) => {
    //remove browser cookies
    response.clearCookie('user_sid');
    //remove session 
    request.session.destroy();
    // redirect to login page
    return response.redirect('/auth/login');

};


//re
const pass = (_request, response, _next) => {
    response.render('pass');

};

//change password controller
const passProcces = safeCall(async (request, response, _next) => {
    //collect data
    const { oldPass, password, confPass } = request.body;

    //validation error handler 
    if (response.locals.error)
        return response.status(400).send({
            success: false,
            message: response.locals.message,
        });

    //check confirm password
    if (password !== confPass)
        return response.status(400).send({
            success: false,
            message: 'password don`t match',
        });

    //get user from session
    const user = request.session.user;

    //find user and get password
    const userTarget = await User.findOne(user).select('+password');
    //error handling for MODEL.FINDBYID
    if (!userTarget)
        return response.status(400).send({
            success: false,
            message: 'update was unsuccesfull',
        });

    //compaire password of user
    const userPass = await bcrypt.compare(oldPass, userTarget.password);

    //error handling for BCRYPT.COMPAIRE
    if (!userPass)
        return response.status(400).send({
            success: false,
            message: 'wrong password',
        });

    //set user password to new password
    userTarget.password = password;

    //save password on user database
    const savedUser = await userTarget.save();

    //error handling for MODEL.SAVE
    if (!savedUser)
        return response.status(400).send({
            success: false,
            message: 'update was succesfull',
        });

    //send success message
    return response.status(200).send({
        success: true,
        message: 'update was succesfull',
    });
});

//delete user acount
const delAccount = safeCall(async (request, response, _next) => {
    // get user data from session
    const user = request.session.user;
    //delete user by id
    await User.findByIdAndDelete(user._id);
    //redirect to logout 
    response.redirect('/auth/logout');

});

const inactivate = safeCall(async (request, response, _next) => {

    //get user from session
    const user = request.session.user;

    //inactivate user
    const inActiveUser = await User.findByIdAndUpdate(user._id, { status: "inactive" });

    //error handling for MODEL.findByIdAndUpdate
    if (!inActiveUser)
        return response.render('error', { error: { message: "there was something wrong" }, stats: 500 });

    //redirect to logout
    response.redirect('/auth/logout');
});

//reset password without login
const resetPassword = safeCall(async (request, response, _next) => {
    //collect data from request
    const { username, email, phone } = request.body;

    //find user by username
    const user = await User.findOne({ username }).select('+password');

    //check for accurate username
    if (!user)
        return response.render('pass',
            {
                ERROR: "wrong username"
            });

    //check for accurate phone number
    if (user.phone !== phone)
        return response.render('pass',
            {
                ERROR: "wrong phone number"
            });

    //change user password to phoe number
    user.password = user.phone;
    const savedUser = await user.save({ validateBeforeSave: false });

    //error handling for MODEL.SAVE
    if (!savedUser)
        return response.render('pass',
            {
                ERROR: "reset password failed"
            });

    //redirec to login page
    return response.redirect('/auth/login');

});

module.exports = {
    login,
    loginProcess,
    register,
    registerProcess,
    logout,
    pass,
    passProcces,
    delAccount,
    inactivate,
    resetPassword
};