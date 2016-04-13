/*
URL: https://yugi-onche.rhcloud.com/rockmongo/
Root User:     admin
Root Password: _CfWtDs1GI1z
Database Name: yugi

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/
*/

var express = require('express'),
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  env = process.env,
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  ent = require('ent');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var secret = require('./app/secret.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());

app.use(session({
  secret: secret.secret
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// routes
require('./app/routes.js')(app, passport);

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//
// var PORT = 8080;
// var IPADDRESS = '127.0.0.1';


app.get('/health', function(req, res) {
  res.writeHead(200);
  res.end();
});

app.use('/', express.static(__dirname + '/public'));

//------------------------

io.sockets.on('connection', function(socket, pseudo) {
  socket.on('nouveau_client', function(pseudo) {
    pseudo = ent.encode(pseudo);
    socket.pseudo = pseudo;
    socket.broadcast.emit('nouveau_client', {
      pseudo: pseudo
    });
  });

  socket.on('message', function(message) {
    message = ent.encode(message);
    socket.broadcast.emit('message', {
      pseudo: socket.pseudo,
      message: message
    });
    socket.emit('message', {
      pseudo: socket.pseudo,
      message: message
    });
  });
});

server.listen(PORT, IPADDRESS);
