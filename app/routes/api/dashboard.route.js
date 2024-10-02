"use strict";
//express
const express = require('express');
const router = express.Router();
//session middleware
const sessionsCheck = require('../../middleware/sessionCheck.middleware');
//validation middleware
const userValidation = require('../../middleware/userValidation.middleware');
//duplicate Check middleware
const duplicate = require('../../middleware/duplicateCheck.middleware');
//controller
const { Dashboard, DashboardProcess, AvatarProcess } = require('../../controller/api/dashboard.controller.js');
//upload Avatar
const upload = require('../../utils/multerInitializer.utils').uploadAvatar;

//check session and cookie
router.use(sessionsCheck.login);

router.route('/')

    //dashboard page
    .get(Dashboard)

    //update user data
    .put(duplicate.dashboard, userValidation('update'), DashboardProcess)

    //update avatar
    .post(upload.single('avatar'), AvatarProcess);

module.exports = router;