var express = require('express');

var controllerAuth = require('../controllers/auth.controller');

var router = express.Router();

router.get('/loginUser', controllerAuth.getLogin);

router.post('/loginUser', controllerAuth.postLogin);

module.exports = router;