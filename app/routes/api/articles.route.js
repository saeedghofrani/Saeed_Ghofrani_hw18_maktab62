"use strict";
//express
const express = require('express');
const router = express.Router();
// controller
const { Articles, AddArticlePage, AddArticleProcess, DelMyArticle, UpdateArticleProcess, UpdateArticlePage, comment, Favorit, delUserComment, SearchProcess } = require('../../controller/api/articles.controller.js');
//multer middleware
const upload = require('../../utils/multerInitializer.utils.js').uploadarticlePicture;
const checkAccess = require('../../middleware/checkAccess.middleware.js');
// session middleware
const sessionsCheck = require("../../middleware/sessionCheck.middleware.js");

const articleValidation = require('../../middleware/articleValidation.middleware.js');

router.use(sessionsCheck.login);

router.route('/setup')
    .get(AddArticlePage)
    .post(upload.single('articlePicture'), articleValidation('create'), AddArticleProcess)
    .delete(checkAccess.deleteArticle, DelMyArticle);

router.route('/updateArticle/:id')
    .get(checkAccess.updateArticle, UpdateArticlePage)
    .post(checkAccess.updateArticle, upload.single('articlePicture'), articleValidation('update'), UpdateArticleProcess);

router.route('/favorit/:id')
    .post(Favorit);

router.route('/:condition')
    .get(Articles)
    .post(SearchProcess);

module.exports = router;    