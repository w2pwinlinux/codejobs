var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , sio = require('../lib/socket.io');

var app = express.createServer();

app.configure(function () {
  app.use(stylus.middleware({ src: __dirname + '/app', compile: compile }));
  app.use(express.static(__dirname + '/app'));
  app.set('views', __dirname);
  app.set('view engine', 'jade');

  function compile (str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  };
});

/* Rutas */

app.get('/', function (req, res) {
  res.render('index', { layout: false });
});

/* Listen */

app.listen(3000, function () {
  var addr = app.address();
  console.log('http://' + addr.address + ':' + addr.port);
});

/* Socket */

var io = sio.listen(app)
  , nicknames = {};

io.sockets.on('connection', function (socket) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', 'El usuario '+ nick + ' se ha conectado');
      io.sockets.emit('nicknames', nicknames);
    }
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', 'El usuario '+ socket.nickname + ' se ha desconectado');
    socket.broadcast.emit('nicknames', nicknames);
  });
});
