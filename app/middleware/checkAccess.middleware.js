const Article = require('../model/article.model');
const mongoose = require('mongoose');

// check access for CoAuthor and admin
const checkAccess = {
    //access for delete article granted to author and admin
    deleteArticle: async (req, res, next) => {
        console.log(req.body);
        const { id } = req.body;
        console.log(id);
        const article = await Article.findById(id);
        console.log(article);
        if (req.session.user._id !== mongoose.Types.ObjectId(article.author._id).valueOf() && req.session.user.role !== 'admin') {
            return res.render('./error', { error: { status: 404, message: "page not found" } });
        }
        next();

    },
    //access for update article granted to author and coAuthor
    updateArticle: async (req, res, next) => {

        const article = await Article.findById(req.params.id).populate('author').populate('CoAuthor');

        const articleId = mongoose.Types.ObjectId(article.author._id).valueOf();
        if (req.session.user._id !== articleId && req.session.user._id !== mongoose.Types.ObjectId(article.CoAuthor._id).valueOf()) {
            return res.render('./error', { error: { status: 404, message: "page not found" } });
        }

        next();
    },
};

module.exports = checkAccess;
