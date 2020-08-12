var shortid = require("shortid");
var db = require("../db");

module.exports.seeUser = function(req, res) {
  var pageUser = parseInt(req.query.pageUser) || 1; //n
  var perPageUser = 4; //x

  var start = (pageUser - 1) * perPageUser;
  var end = pageUser * perPageUser;

  var drop = (pageUser - 1) * perPageUser;
  res.render("users/seeUser", {
    // users: db.get("users").value()
    users: db.get('users').drop(drop).take(perPageUser).value()
  });
};

module.exports.searchUser = function(req, res){
	var q = req.query.q;
	var matchedUsers = db.get('users').value().filter(function(user){
		return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});

	res.render('users/seeUser', {
		users: matchedUsers
	});
};


module.exports.getAddUser = function(req, res) {
  res.render("users/addUser");
  };

module.exports.postAddUser = function(req, res) {
  req.body.id = shortid.generate();
  req.body.avatar = req.file.path.split('/').slice(1).join('/');
  
  var errors = [];

	if(!req.body.name){
		errors.push('Name is required.')
	}

	if(parseInt(req.body.name.length) >= 30){
		errors.push('Name is qua dai.')
	}

	if(!req.body.phone){
		errors.push('Phone is required.')
	}

	if(errors.length){
		res.render('users/addUser', {
			errors: errors,
			values: req.body
		});
		return;
	}
  
  db.get("users")
    .push(req.body)
    .write();
  res.render("users/seeUser", {
    users: db.get("users").value()
  });
  res.redirect("/users");
};

module.exports.update = function(req, res) {
  res.render("users/update-name");
  };

module.exports.getUpdate = function(req, res) {
  var id = req.params.id;
  res.render("users/update-name", {
    id: id
  });
};

module.exports.postUpdate = function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
    db.get("users")
      .find({ id: id })
      .assign({ name: name })
      .write();
    res.redirect("/users/seeUser");
};

module.exports.delete = function(req, res) {
  var name = req.params.name;
  db.get("users")
    .remove({ name: name })
    .write();
  res.render("users/seeUser", {
    users: db.get("users").value()
  });
};