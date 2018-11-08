var express = require('express');
var socket = require('socket.io');

var app = express();

server = app.listen(5000, function(){
    console.log('Server is running on port 5000')
});

io = socket(server);

io.on('connection', (socket) => {
    
    console.log("Connected: " + socket.id);

    var clients = Object.keys(io.engine.clients);
    io.emit('online', clients)

    socket.on('disconnect', function(){
        console.log('Disconnected: ' + socket.id);

        var clients = Object.keys(io.engine.clients);
        io.emit('online', clients)
    })

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })
});