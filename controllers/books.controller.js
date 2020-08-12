var shortid = require("shortid");
var db = require("../db");

module.exports.see = function(req, res) {
  var page = parseInt(req.query.page) || 1; //n
  var perPage = 8; //x

  var start = (page - 1) * perPage;
  var end = page * perPage;

  var drop = (page - 1) * perPage;
  
  res.render("books/see", {
    //books: db.get("books").value()
    books: db.get('books').drop(drop).take(perPage).value()
  });
};

module.exports.searchBook = function(req, res){
	var q = req.query.q;
	var matchedBooks = db.get('books').value().filter(function(book){
		return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});

	res.render('books/see', {
		books: matchedBooks
	});
};

module.exports.getAdd = function(req, res) {
  res.render("books/add");
  };

module.exports.postAdd = function(req, res) {
  req.body.id = shortid.generate();
  db.get("books")
    .push(req.body)
    .write();
  res.render("books/see", {
    books: db.get("books").value()
  });
  res.redirect("/books");
};

module.exports.update = function(req, res) {
  res.render("books/update");
  };

module.exports.getUpdate = function(req, res) {
  var id = req.params.id;
  res.render("books/update", {
    id: id
  });
};

module.exports.postUpdate = function(req, res) {
  var id = req.body.id;
  var title = req.body.title;
    db.get("books")
      .find({ id: id })
      .assign({ title: title })
      .write();
    res.redirect("/books/see");
};

module.exports.delete = function(req, res) {
  var title = req.params.title;
  db.get("books")
    .remove({ title: title })
    .write();
  res.render("books/see", {
    books: db.get("books").value()
  });
};