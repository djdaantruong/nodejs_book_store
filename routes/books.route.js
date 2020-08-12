var controllerBook = require("../controllers/books.controller")
var express = require("express");
var router = express.Router();

//BOOKS
router.get("/see", controllerBook.see);
router.get('/search', controllerBook.searchBook);

//Add books
router.get('/add', controllerBook.getAdd);
router.post("/add", controllerBook.postAdd);

//Update title
router.get('/update', controllerBook.update);
router.get("/:id/update", controllerBook.getUpdate);
router.post("/update", controllerBook.postUpdate);

//Delete books
router.get("/:title/delete", controllerBook.delete);

module.exports = router;