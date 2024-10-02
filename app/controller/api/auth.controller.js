// Module dependencies.
const bcrypt = require('bcryptjs');
const deletePicture = require('../../utils/deletePicture.utils');
//user model
const User = require('../../model/user.model');
//article model
const Article = require('../../model/article.model');
const Comment = require('../../model/comment.model');
// wrapper contain trycatch for error handling
const safeCall = require('../../utils/safeCall.utils');

class AuthController {

    //render login page
    Login = (_request, response, _next) => {
        return response.render('login');
    };

    //check username and password for access to dashboard
    LoginProcess = safeCall(async (request, response, _next) => {
        // get user pass from request
        const { username, password } = request.body;
        // find user by username and get password
        const user = await User.findOne({ username }).select('+password').populate('favorites');
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
        console.log(request.session.user);
        return response.redirect('/dashboard');
    });

    //render Rigester page
    Register = (_request, response, _next) => {
        response.render('register');
    };

    //create acount 
    RegisterProcess = safeCall(async (request, response, _next) => {
        //validation error handler 
        if (response.locals.error)
            return response.render('register', {
                ERROR: response.locals.message
            });

        // collect data from request body (form)
        const data = {
            username: request.body.username,
            password: request.body.password,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            phone: request.body.phone
        } = request.body;
        //create user by collected data
        const user = await User.create(data);
        //error handling for MODEL.CREATE
        if (!user)
            return response.render('register', {
                ERROR: 'creating user was unsuccessful'
            });
        //set session for user
        // request.session.user = user;
        //redirect to dashboard
        return response.redirect('/auth/login');
    });

    //logout controller 
    Logout = (request, response, _next) => {
        //remove browser cookies
        response.clearCookie('user_sid');
        //remove session 
        request.session.destroy();
        // redirect to login page
        return response.redirect('/auth/login');

    };

    Pass = (_request, response, _next) => {
        response.render('pass');

    };
    //change password controller
    PassProcces = safeCall(async (request, response, _next) => {
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
    DelAccount = safeCall(async (request, response, _next) => {
        // get user data from session
        const user = request.session.user;
        //delete user by id
        await User.findByIdAndDelete(user._id);
        //delet articles 
        const allUserArticle = await Article.find({ author: user._id });
        for (let i = 0; i < allUserArticle.length; i++) {
            await Comment.deleteMany({ "postId": allUserArticle[i]._id });
            deletePicture(process.cwd() + "/public/images/article", allUserArticle[i].image);
        }

        await Article.deleteMany({ author: user._id });
        /**
         *! how to delet all comments
         */
        // await Comment.deleteMany({"postId": { $in: [10, 2, 3, 5]}});

        await Comment.deleteMany({ username: user._id });

        if (request.session.user.avatar !== "profileAvatar.jpg")
            deletePicture(process.cwd() + "/public/images/avatars", request.session.user.avatar);
        //redirect to logout 
        response.redirect('/auth/logout');

    });

    Inactivate = safeCall(async (request, response, _next) => {
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
    ResetPassword = safeCall(async (request, response, _next) => {
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
        const savedUser = await user.save();
        //error handling for MODEL.SAVE
        if (!savedUser)
            return response.render('pass',
                {
                    ERROR: "reset password failed"
                });

        //redirec to login page
        return response.redirect('/auth/login');
    });
}

module.exports = new AuthController()