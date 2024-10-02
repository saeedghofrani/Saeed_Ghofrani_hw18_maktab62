const { titleValidation, descriptionValidation, contentValidation, imageValidation } = require('../utils/articleValidation.utils');
const createError = require('http-errors');
const wraper = (mod) => {
    return articleValidation = async (req, res, next) => {
        try {
            res.locals = { error: false, message: [] };
            // create validation
            if (mod === 'create') {
                titleValidation(req, res);

                descriptionValidation(req, res);

                contentValidation(req, res);

                imageValidation(req, res);

                next();
            }
            //update validation
            if (mod === 'update') {

                titleValidation(req, res);

                descriptionValidation(req, res);

                contentValidation(req, res);

                if (req.file)
                    imageValidation(req, res);

                next();
            }
        } catch (error) {
            next(createError(500));
        }
    };
}
module.exports = wraper;