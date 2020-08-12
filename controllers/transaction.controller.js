var shortid = require("shortid");
var db = require("../db");

module.exports.seeTransaction = function(req, res) {
  var pageTrans = parseInt(req.query.pageTrans) || 1; //n
  var perPageTrans = 4; //x

  var start = (pageTrans - 1) * perPageTrans;
  var end = pageTrans * perPageTrans;

  var dropTrans = (pageTrans - 1) * perPageTrans;
  
  var user = db.get('users').find({ id: req.signedCookies.userId }).value();
  
  // var Transactions = db.get('transactions').value();
  var Transactions = db.get('transactions').drop(dropTrans).take(perPageTrans).value();
  console.log(Transactions);
  var matchedTransactions = Transactions.filter(function(Transaction){
    return Transaction.user.id == req.cookies.userId;
  })

  console.log(user);
  if(!user.isAdmin){
    res.render("transaction/seeTransaction", {
    transactions: matchedTransactions
  });
  }
  
  res.render("transaction/seeTransaction", {
    transactions: Transactions
  });
  
};

module.exports.searchTransaction = function(req, res){
	var q = req.query.q;
	var matchedTransactions = db.get('transactions').value().filter(function(transaction){
		return transaction.isComplete.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});

	res.render('transaction/seeTransaction', {
		transactions: matchedTransactions
	});
};

module.exports.getCreate = function(req, res) {
  res.render("transaction/create", {
      users: db.get("users").value(),
      books: db.get("books").value()
  });
};

module.exports.postCreate = function(req, res) {
  var userObj = JSON.parse(req.body.user);
  var bookObj = JSON.parse(req.body.book);
  var dataTransaction = {
    isComplete : false,
    user : userObj,
    book : bookObj,
    id : shortid.generate()
  }
  
  db.get("transactions").push(dataTransaction).write();
  res.redirect("/transaction/seeTransaction");
};

module.exports.isComplete = function(req,res) {
  var id = req.params.id;
  db.get("transactions").find({id:id}).assign({isComplete : true}).write();
  res.redirect("/transaction/seeTransaction")
}