const session = {
    //check if user dont have session
    login: (req, res, next) => {
        console.log('here123');
        if (!req.session.user || !req.cookies.user_sid)
            return res.redirect('/auth/login');

        next();
    },
    //check if user have session
    dashboard: (req, res, next) => {

        if (req.session.user && req.cookies.user_sid)
            return res.redirect('/dashboard');

        next();
    }
};

module.exports = session;