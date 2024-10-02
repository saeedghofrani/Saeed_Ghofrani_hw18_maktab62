//express
const express = require('express');
const router = express.Router();

//Junction Box
const dashboardRouter = require('./api/dashboard.route.js');
const articlesRouter = require('./api/articles.route.js');
const authRouter = require('./api/auth.route.js');
const adminRouter = require('./api/admin.route.js');
const commentRouter = require('./api/comment.route.js');
const exposeRouter = require('./api/expose.route.js');

//route and address
router.use('/', exposeRouter);
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/articles', articlesRouter);
router.use('/admin', adminRouter);
router.use('/comment', commentRouter);

module.exports = router;