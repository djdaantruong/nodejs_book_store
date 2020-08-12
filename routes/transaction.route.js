var controllerTransaction = require("../controllers/transaction.controller")
var express = require("express");
var router = express.Router();

//TRANSACTIONS
router.get("/seeTransaction", controllerTransaction.seeTransaction);
router.get('/search', controllerTransaction.searchTransaction);

//Add transaction
router.get("/create", controllerTransaction.getCreate);
router.post("/create", controllerTransaction.postCreate);
router.get("/:id/complete", controllerTransaction.isComplete);

module.exports = router;