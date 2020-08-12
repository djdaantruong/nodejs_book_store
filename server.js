require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var userRoute = require("./routes/users.route")
var bookRoute = require("./routes/books.route")
var transactionRoute = require("./routes/transaction.route");

var authRoute = require('./routes/auth.route');

var authMiddleware = require('./middlewares/auth.middleware');

var db = require("./db.js");

var app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static("public"));

//HOME
app.get("/", function(req, res){
	res.render('home');
});

var count = 0;
function cookieCount(req, res, next) {
  count++;
  console.log(req.cookies, ":", count);
  next();
}

app.use("/books", cookieCount, authMiddleware.requireAuth, bookRoute);
app.use("/users", cookieCount, authMiddleware.requireAuth, userRoute);
app.use("/transaction", cookieCount, authMiddleware.requireAuth, transactionRoute);
app.use('/auth', authRoute);

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
