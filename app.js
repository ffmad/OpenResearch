var assert = require('assert');
var bitcoin   = require('bitcoin');
var bitcore   = require('bitcore');
var express   = require('express');
var nunjucks  = require('nunjucks');
var _  = require('underscore');

/***** var Chain = require('chain-node');
var chain = new Chain({
  keyId: '50eda91debdf37f524f2a1be3653d291',
  blockChain: 'bitcoin'
});

Chain.com -> dead
********/

var app = express();
var server = app.listen(777);
var io = require('socket.io').listen(server);

nunjucks.configure('views', {
    autoescape : true,
    express : app,
    watch: true
});

// render pages

app.get('/', function(req, res) {
    res.render('index.html');
});
app.get('/register', function(req, res) {
    res.render('register.html');
});
app.get('/login', function(req, res) {
    res.render('login.html');
});
app.get('/home', function(req, res) {
    res.render('home.html');
});
app.get('/paper-submit', function(req, res) {
    res.render('submit_paper.html');
});
app.get('/paper', function(req, res) {
    res.render('paper.html');
});
app.get('/home/:address', function(req, res) {
	var newData= { myAddress: req.params.address, myAccount: myAccount };
    res.render('home.html', newData);
});
app.get('/404', function(req, res) {
    res.render('404.html');
});

app.use(express.static(__dirname + '/views'));
app.use(redirectUnmatched);

function redirectUnmatched(req, res) {
  res.redirect("/404");
}
console.log("Listening to port 777");
