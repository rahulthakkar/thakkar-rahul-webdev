var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

//console.log("process.env" +JSON.stringify(process.env, null,2));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require ("./test/app.js")(app);
//require("./assignment/app.js")(app);
require("./project/app.js")(app);


var port = process.env.PORT || 3000;

app.listen(port);