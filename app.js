var express = require('express'),
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  env = process.env,
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  ent = require('ent');

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/health', function(req, res) {
  res.writeHead(200);
  res.end();
});

app.use('/', express.static(__dirname + '/static'));

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
