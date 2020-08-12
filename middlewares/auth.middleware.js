var db = require('../db');

module.exports.requireAuth = function(req, res, next){
  console.log(req.signedCookies);
    if (!req.signedCookies.userId) {
        res.redirect('/auth/loginUser');
        return;
    }
    var user = db.get('users').find({ id: req.signedCookies.userId }).value();
    if (!user) {
        res.redirect('/auth/loginUser');
        return;      
    }
  
  res.locals.user = user;
  
    next();
};

module.exports.uniqueEmail = function(req, res, next){
    var email = req.body.email;
    var user = db.get('users').find({
        email: email
    }).value();

    if(user){
        res.redirect('auth/login');
        return;
    }

    next();
};