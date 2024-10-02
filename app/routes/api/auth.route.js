"use strict";
//express
const express = require('express');
const router = express.Router();
//session middleware
const sessionsCheck = require('../../middleware/sessionCheck.middleware');
// validation middleware
const userValidator = require('../../middleware/userValidation.middleware');
// duplicate Check middleware
const duplicate = require('../../middleware/duplicateCheck.middleware');
//controller
const { Login, LoginProcess, Register, RegisterProcess, Logout, Pass, PassProcces, DelAccount, Inactivate, ResetPassword } = require('../../controller/api/auth.controller.js');

//forget password router
router.route('/pass')
    .get(Pass)
    .put(userValidator('pass'), PassProcces)
    .post(ResetPassword);

//inactavate user router
router.route('/inActive')
    .get(Inactivate);

//remove acount 
router.route('/delAccount')
    .get(DelAccount);

//logout route
router.route('/logout')
    .get(Logout);

//check session and cookie
router.use(sessionsCheck.dashboard);

//login router
router.route('/login')
    .get(Login)
    .post(LoginProcess);

//register router
router.route('/register')
    .get(Register)
    .post(duplicate.register, userValidator('create'), RegisterProcess);


module.exports = router;