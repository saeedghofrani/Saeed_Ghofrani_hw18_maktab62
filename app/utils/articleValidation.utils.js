const titleValidation = (req, res) => {
    if (!req.body.title || req.body.title.trim().length > 100 || req.body.title.trim().length < 5) {
        res.locals.error = true;
        res.locals.message.push('title is required and most be more than 5 less then 30 characters');
    }
};
const descriptionValidation = (req, res) => {
    console.log(req.body);
    if (!req.body.description || req.body.description.trim().length < 40 || req.body.description.trim().length > 200) {
        res.locals.error = true;
        res.locals.message.push('description is required and most be more than 40 less then 130 characters');
    }
};
const contentValidation = (req, res) => {
    if (!req.body.content) {
        res.locals.error = true;
        res.locals.message.push('content is required');
    }
};
const imageValidation = (req, res) => {
    if (!req.file) {
        res.locals.error = true;
        res.locals.message.push('image is required');
    }
};
module.exports = {
    titleValidation,
    descriptionValidation,
    contentValidation,
    imageValidation
};