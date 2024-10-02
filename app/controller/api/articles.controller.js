const Article = require('../../model/article.model');
const User = require('../../model/user.model');
const Comment = require('../../model/comment.model');
// wrapper contain trycatch for error handling
const safeCall = require('../../utils/safeCall.utils');

const deletePicture = require('../../utils/deletePicture.utils');

class ArticleController {
    //render article page 
    Articles = safeCall(async (request, response) => {

        const condition = request.params.condition;

        if (condition === 'all') {
            const topArticle = await Article.find({}).sort({ visitCount: -1 }).limit(1);
            return response.render('./article/articles', { topArticle, user: request.session.user });
        }

        if (condition.split('=')[0] === 'all') {

            const skip = Number(condition.split('=')[1]) * 6;
            //collect data from database sort bt createdAt
            const articles = await Article.find({}).sort({ createdAt: -1 }).populate('author').skip(skip).limit(6);
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

    //render add article page
    AddArticlePage = (request, response, _next) => {
        return response.render('./article/addArticle');
    };

    //add article procces 
    AddArticleProcess = safeCall(async (request, response, _next) => {
        //validation for aticle input
        if (response.locals.error)
            return response.status(400).send({
                success: false,
                message: response.locals.message,
                data: null
            });
        //collect user data from session
        let data = {
            title: request.body.title,
            content: request.body.content,
            description: request.body.description,
            image: request.file.filename,
            author: request.session.user._id
        };
        if (request.body.CoAuthor) {
            const CoAuthor = await User.findOne({ username: request.body.CoAuthor });
            data.CoAuthor = CoAuthor._id;
        }
        //create article
        const article = await Article.create(data);
        //error handling for create
        if (!article) {
            return response.status(500).send({
                success: false,
                message: 'Article not created',
                data: null
            });
        }
        //send success message
        return response.status(200).send({
            success: true,
            message: 'Article created',
            data: null
        });

    });

    DelMyArticle = safeCall(async (request, response, _next) => {
        //collect id from request
        const article = await Article.findByIdAndUpdate(request.body.id, { deleted: true });

        if (!article)
            return response.status(400).send({
                success: false,
                message: 'delete article was unsuccesfull',
            });

        deletePicture(process.cwd() + "/public/images/article", article.image);
        //send success message
        response.status(200).send({
            success: true,
            message: 'delete article was succesfull',
        });
    });

    //update article page 
    UpdateArticlePage = safeCall(async (request, response, _next) => {
        const article = await Article.findById(request.params.id).populate('CoAuthor');
        return response.render('./article/updateArticle', { data: article });
    });
    //update article process
    UpdateArticleProcess = safeCall(async (request, response, _next) => {

        //validation for update article
        if (response.locals.error)
            return response.status(400).send({
                success: false,
                message: response.locals.message,
                data: null
            });

        const article = {
            title: request.body.title,
            content: request.body.content,
            description: request.body.description
        };

        if (request.file)
            article.image = request.file.filename;

        const updatedArticle = await Article.findByIdAndUpdate(request.params.id, article);

        if (request.file)
            deletePicture(process.cwd() + "/public/images/article", updatedArticle.image);

        return response.status(200).send({
            success: true,
            message: 'delete article was succesfull',
        });
    });


    Favorit = safeCall(async (request, response, next) => {

        const id = request.params.id;
        const article = await Article.findById(id);
        const user = request.session.user;

        if (request.body.data === "1") {
            article.favorit++;
            const updatedUer = await User.findByIdAndUpdate(user._id, { "$push": { "favorites": article._id } }, { new: true }).populate('favorites');
            await article.save();
            request.session.user = updatedUer;
            return response.status(200).send({
                success: true,
                message: 'article favorit',
            });
        }
        if (request.body.data === "0") {
            article.favorit--;
            const updatedUer = await User.findByIdAndUpdate(user._id, { "$pullAll": { "favorites": article._id } }, { new: true }).populate('favorites');
            await article.save();
            request.session.user = updatedUer;
            return response.status(200).send({
                success: true,
                message: 'article favorit',
            });
        }
    });
    SearchProcess = safeCall(async (request, response) => {
        const searchText = request.params.condition;
        const articles = await Article.find({ $text: { $search: searchText } }).limit(6);
        console.log(articles);
        return response.status(200).send({
            success: true,
            message: 'done',
            data: articles,
        });
    });
}

module.exports = new ArticleController()