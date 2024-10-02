(async () => {
    try {
        require("../db/connection.db");
        const User = require('../model/user.model');
        const Article = require('../model/article.model');
        const Comment = require('../model/comment.model');
        const user = await User.deleteMany({});
        const article = await Article.deleteMany({});
        const comment = await Comment.deleteMany({});
        if (user && article && comment) {
            console.log('evacuation complete');
            return process.exit(1);
        }
        console.log('evacuation failed');
        return process.exit(1);
    } catch (error) {
        console.log(`server error:\n ` + `please first check if there is an admin\n` + ` then make sure database is connected\n` + error);
    }
})();