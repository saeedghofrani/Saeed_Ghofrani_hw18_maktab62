"use strict";
const express = require('express');
const router = express.Router();
const logout = require('../controller/logout.controller.js');
router.route('/')
    .get(logout);
module.exports = router;