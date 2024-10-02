// try catch function for error handling
const safeCall = require('../../utils/safeCall.utils');
//user model
const User = require('../../model/user.model');
const Article = require('../../model/article.model');
const Comment = require('../../model/comment.model');
const deletePicture = require('../../utils/deletePicture.utils');

class AdminController {

    //render table user for admin
    Admin = safeCall(async (request, response, _next) => {
        //collect users from database
        const users = await User.find({});
        response.render('admin', { users });

    });

    ResetPass = safeCall(async (request, response, _next) => {
        // collect users from database + password 
        const user = await User.findById(request.body.id).select('+password');

        //error handling for find by id
        if (!user)
            return response.status(400).send({
                success: false,
                message: 'reset password was unsuccesfull',
            });

        //validateBeforeSave
        user.password = user.phone;
        const savedUser = await user.save({ validateBeforeSave: false });

        //error handling for MODEL.SAVE
        if (!savedUser)
            return response.status(400).send({
                success: false,
                message: 'reset password was unsuccesfull',
            });

        //send success message
        return response.status(200).send({
            success: true,
            message: 'reset password was succesfull',
        });
    });

    DeleteUser = safeCall(async (request, response, _next) => {


        const allUserArticle = await Article.find({ author: request.body.id });
        console.log(allUserArticle);
        for (let i = 0; i < allUserArticle.length; i++) {
            await Comment.deleteMany({ "postId": allUserArticle[i]._id });
            deletePicture(process.cwd() + "/public/images/article", allUserArticle[i].image);
        }
        // Promise.all(allUserArticle.map((value, index, array) => {
        //     Comment.deleteMany({ "postId": value._id });
        //     deletePicture("../public/images/article", value.image);
        // }));

        //collect users from database by id
        const user = await User.findByIdAndDelete(request.body.id);



        // const allUserArticle = await Article.find({ author: user._id });

        // for (let i = 0; i < allUserArticle.length; i++) {
        //     await Comment.deleteMany({ "postId": allUserArticle[i]._id });
        //     deletePicture("../public/images/article", allUserArticle[i].image);
        // }

        // await Article.deleteMany({ author: user._id });

        // await Comment.deleteMany({ username: user._id });

        if (user.avatar !== "profileAvatar.jpg")
            deletePicture(process.cwd() + "public/images/avatars", user.avatar);
        //redirect to logout 
        return response.status(200).send({
            success: true,
            message: 'delete was succesfull',
        });
    });

}

module.exports = new AdminController()