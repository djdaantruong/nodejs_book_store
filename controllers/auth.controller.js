// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.API_KEY);
// const saltRounds = 10;
require('dotenv').config();
var db = require("../db");
var md5 = require('md5');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var db = require('../db');

module.exports.getLogin = function(req, res){
	res.render('auth/loginUser');
};

module.exports.postLogin = function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  var user = db.get('users').find({ email: email }).value();

  console.log(user.wrongLoginCount);
  
  if (!user.wrongLoginCount) {
         db.get("users")
           .find({ id: user.id })
           .set("wrongLoginCount", 0)
           .write();
      }
  if (user.wrongLoginCount >= 4) {

        var transport = nodemailer.createTransport({
            service: "Gmail",
            port: 2525,
            auth: {
              user: process.env.adminEmail,
              pass: process.env.adminPassword
            }
          });
        console.log(transport);
    
        res.render("auth/loginUser", {
            errors: ["Your account has been locked."],
            values: req.body
        });
    
    var mailOptions = {
            from: process.env.adminEmail,
            to: 'daantd.a12017@gmail.com',
            subject: 'Cảnh báo đăng nhập',
            text: `Your account ${email} has been locked`,
            html: '<b>Your account has been locked.Admin: Djdaan Truong<b/>'
           
          };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
          });
    return;
    }
  
  if(!user) {
        res.render('auth/loginUser', {
            errors: [
                'User does not exist.'
            ],
            values: req.body
        });
        return;
    }
  
  console.log(user);
    //ASYNC
  var bcrypt = require('bcrypt');
  var saltRounds = 10;
  var myPlaintextPassword = password ;
    
  var salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);

//    console.log(hash);

//    console.log(user.password);

//    console.log(bcrypt.compareSync(myPlaintextPassword, user.password));
//     // hash -> store db user.password
  
    if(!bcrypt.compareSync(myPlaintextPassword, user.password)){

        db.get("users")
            .find({ id: user.id })
            .assign({ wrongLoginCount: (user.wrongLoginCount += 1) })
            .write();

        res.render('auth/loginUser',{
            errors: [
                'User does not exist.'
            ],
            values: req.body
        });
        return;
    }
  
    res.cookie('userId', user.id, {
        signed: true
    });
    res.redirect('/users/seeUser');
};