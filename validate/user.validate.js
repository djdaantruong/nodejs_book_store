module.exports.postAddUser = function(req, res, next){
    var errors = [];

	if(!req.body.name){
		errors.push('Name is required.')
	}

	if(parseInt(req.body.name.length) >= 30){
		errors.push('Name is too long.')
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
    
    next();
};