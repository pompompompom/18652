var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.get('/', function(req, res){
  res.sendfile('chat.html');
});

app.get('/chat', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  //Broadcast incomming messages to everyone who is listening on c_msg_pkt
  socket.on('c_msg_pkt', function(msg){
    console.log('message: ' + msg);
    io.emit('c_msg_pkt', msg);
  });


  socket.on('c_msg_adduser', function(msg){
    console.log('Adding User: ' + msg);
    socket.username = msg;
    io.emit('c_msg_newuser', msg);
  });

  //disconnected user
  socket.on('disconnect', function(){
    console.log('Deleting user: ' + socket.username);
    io.emit('c_msg_deleteuser',  socket.username);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
