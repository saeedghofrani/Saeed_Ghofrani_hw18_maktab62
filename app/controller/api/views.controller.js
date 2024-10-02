const Article = require('../../model/article.model');
const User = require('../../model/user.model');
const Comment = require('../../model/comment.model');
// wrapper contain trycatch for error handling
const safeCall = require('../../utils/safeCall.utils');

class ViewsController {

    Articles = safeCall(async (request, response, _next) => {

        const condition = request.params.condition;

        if (condition === 'all') {
            const topArticle = await Article.find({}).sort({ visitCount: -1 }).limit(1);
            return response.render('./article/articles', { topArticle, user: request.session.user });
        }

        if (condition.split('=')[0] === 'all') {

            const skip = Number(condition.split('=')[1]) * 6;
            //collect data from database sort bt createdAt
            const articles = await Article.find({}).sort({ createdAt: -1 }).skip(skip).limit(6);
            const count = await Article.find({}).count();

            //render artile page sorted 
            return response.status(200).send({
                success: true,
                message: 'done',
                data: articles,
                count,
                user: request.session.user
            });

        }

        //get users article
        if (condition === 'myArticle') {

            const user = request.session.user;
            // const myArticle = await Article.find({ author: user._id }).populate('author').sort({ createdAt: -1 });
            const myArticle = await Article.find({ $or: [{ 'author': user._id }, { 'CoAuthor': user._id }] }).sort({ createdAt: -1 });
            return response.render('./article/myArticles', { data: myArticle });
        }

        const article = await Article.findById(request.params.condition);
        const comment = await Comment.find({ 'postId': article._id }).lean();
        //add visit count of article 
        if (request.session.user.username !== article.author.username) {
            article.visitCount++;
            article.save();
        }
        return response.render('./article/article', { data: article, user: request.session.user, comment });

    });

    AddArticlePage = (request, response, _next) => {
        response.render('./article/addArticle');
    };
    UpdateArticlePage = safeCall(async (request, response, _next) => {
        const article = await Article.findById(request.params.id).populate('CoAuthor');
        return response.render('./article/updateArticle', { data: article });
    });
}

module.exports = new ViewsController();