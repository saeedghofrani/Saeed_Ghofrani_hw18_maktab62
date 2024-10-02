"use strict";
//express
const express = require('express');
const router = express.Router();
const authorization = require('../../middleware/authorization.middleware');
const sessionsCheck = require("../../middleware/sessionCheck.middleware");
const { userComment, Comment, delUserComment, UserComment, DelUserComment } = require('../../controller/api/comment.controller.js');

router.use(sessionsCheck.login);
// router.route('/')

router.route('/:id')
    .get(authorization(['admin']), UserComment)
    .post(Comment)
    .delete(DelUserComment);

module.exports = router;