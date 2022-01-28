const User = require('../model/user.model');
const safeCall = require('../utils/safeCall.utils');

const dashboard = (request, response, _next) => {
    const data = {
        firstName,
        lastName,
        username,
        password,
        gender,
        phone
    } = request.session.user;

    return response.render('dashboard', { data: data });
};

const dashboardProcess = safeCall(async (request, response, _next) => {
    //validation handler
    if (response.locals.error)
        return response.status(400).send({
            success: false,
            message: 'user update was unsuccessfully.',
            data: response.locals.message
        });

    const user = request.session.user;
    const data = {
        firstName,
        lastName,
        username,
        email,
        gender,
        phone,
        password: user.password
    } = request.body;
    const updatedUser = await User.findOneAndUpdate(user, data, { new: true, overwrite: true }).lean();

    if (!updatedUser)
        return response.status(400).send({
            success: false,
            message: 'user update was unsuccessfully.',
            data: updatedUser
        });
    request.session.user = updatedUser;
    return response.status(200).send({
        success: true,
        message: 'user updated successfully.',
        data: updatedUser
    });
});

module.exports = { 
    dashboard, 
    dashboardProcess 
};