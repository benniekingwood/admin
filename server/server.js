var path = require('path')
express = require('express.io')
app = express().http().io()

app.configure(function () {
	app.set('port', process.env.PORT || 8080);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(app.router);
});

// development environment settings
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
// production environment settings
app.configure('production', function(){
    app.use(express.errorHandler());
});
// Bootstrap routes
require('./config/routes')(app)

// routing
app.get('/', function (req, res) {
    // TODO: if user is not logged in
    var user_auth = false;
    if(user_auth) {
        res.sendfile(__dirname + '/views/signin.html');
    } else {
        res.sendfile(__dirname + '/views/index.html');
    }

});

app.get('/events', function (req, res) {
    res.sendfile(__dirname + '/views/events.html');
});

app.listen(app.get('port'));

// usernames which are currently connected to the chat
var usernames = {};
app.io.sockets.on('connection', function (socket) {

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    app.io.sockets.emit('updatechat', socket.username, data);
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // update the list of users in chat, client-side
    app.io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    app.io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});