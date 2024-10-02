//aticle model
const Comment = require('../../model/comment.model');
// wrapper contain trycatch for error handling
const safeCall = require('../../utils/safeCall.utils');
class CommentController {

    Comment = safeCall(async (request, response, _next) => {

        const id = request.params.id;
        const user = request.session.user;
        const { detail } = request.body;
        const data = {
            postId: id,
            username: user._id,
            detail: detail
        };

        if (request.body.parentCommentId) {
            data.parentCommentId = request.body.parentCommentId;
        }

        let comment = await Comment.create(data);
        comment = await Comment.populate(comment, { path: "username" });
        // comment = await comment.populate('username').populate('parentCommentId');
        console.log(comment);

        return response.status(200).send({
            success: true,
            message: 'article comment',
            data: comment
        });


    });

    UserComment = safeCall(async (request, response, _next) => {
        const id = request.params.id;
        const comments = await Comment.find({ username: id }).populate('username');
        return response.status(200).send({
            success: true,
            message: 'comments send successfull',
            data: comments
        });
    });

    DelUserComment = safeCall(async (request, response, _next) => {
        const id = request.params.id;
        const comment = await Comment.findByIdAndDelete(id);
        console.log(comment);
        return response.status(200).send({
            success: true,
            message: 'comments send successfull',
            data: comment
        });
    });

}

module.exports = new CommentController()