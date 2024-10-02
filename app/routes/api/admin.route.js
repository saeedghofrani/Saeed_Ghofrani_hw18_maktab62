"use strict";
//express
const express = require('express');
const router = express.Router();
// controller
const { Admin, ResetPass, DeleteUser } = require('../../controller/api/admin.controller.js');
// session middleware
const sessionsCheck = require("../../middleware/sessionCheck.middleware.js");
// authorization middleware
const authorization = require('../../middleware/authorization.middleware.js');


// check session
router.use(sessionsCheck.login);

// authoriz route for roles
router.use(authorization(['admin']));

router.route('/')

    //admin page
    .get(Admin)

    //restet user password
    .patch(ResetPass)

    //delete user
    .delete(DeleteUser)

module.exports = router;