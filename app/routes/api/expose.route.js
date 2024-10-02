"use strict";
//express
const express = require('express');
const router = express.Router();
//controller

const { Contact, ContactProcces, Home, About } = require('../../controller/api/expose.controller.js');

router.route('/home')
    .get(Home);

router.route('/about')
    //about page
    .get(About);

router.route('/contact')
    .get(Contact)
    .post(ContactProcces);

module.exports = router;