/*
    function to exclode user from accessing to specified routes
*/
//a wrapper to cloaser main function with array of role
const accessController = (roles) => {
    // main function
    return function (req, res, next) {
        // check array of roles for user session role
        if (!roles.includes(req.session.user.role)) {
            return res.render('error', { error: { message: "page has gone missing", status: 404 } });
        }
        next();
    };
};

module.exports = accessController;