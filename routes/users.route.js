var controllerUser = require("../controllers/users.controller")
var validate = require('../validate/user.validate');
var express = require("express");
var multer  = require('multer');

var upload = multer({ dest: './public/uploads/' });

var router = express.Router();

//USERS
router.get("/seeUser", controllerUser.seeUser);
router.get('/search', controllerUser.searchUser);

//Add users
router.get("/addUser", controllerUser.getAddUser);
router.post("/addUser", upload.single('avatar'), validate.postAddUser, controllerUser.postAddUser);

//Update name

router.get("/update-name", controllerUser.update);
router.get("/:id/update", controllerUser.getUpdate);
router.post("/update", controllerUser.postUpdate);

// //Delete users
router.get("/:name/delete", controllerUser.delete);

module.exports = router;