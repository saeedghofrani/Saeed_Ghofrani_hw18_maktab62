const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Article',
        required: true,
    },
    parentCommentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment',
        required: false,
    },
    username: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },  
    detail: {
        type: String,
        required: true,
    },
}, { timestamps: true });

CommentSchema.pre(/^find/, function (next) {
    this.populate('username').populate({ path: 'parentCommentId', populate: { path: 'username' } });
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);