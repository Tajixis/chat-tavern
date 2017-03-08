var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//un user par machine ! cookie ?
//https://www.npmjs.com/package/socket.io.users
app.use(express.static(__dirname + '/assets'));
//link to index.html
app.get('/', function(req, res){
    res.sendFile("index.html", {"root": __dirname});
});


var room_n = 1;
var joined = false;
var people = [];
var currentConnections = {};

//When user connecte
io.on('connection', function(socket){
    console.log('user connection');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    //s-room
    joined = false;
    room_n = 1;

    //Loop for room test
    while(joined == false){
        //if room have less than 2 people
        if(io.nsps['/'].adapter.rooms["room-"+room_n] && io.nsps['/'].adapter.rooms["room-"+room_n].length < 2){
            console.log(room_n);
            socket.join("room-"+room_n);
            joined =true;
        }
        //no room ! create one
        else if(!(io.nsps['/'].adapter.rooms["room-"+room_n])){
            console.log(room_n);
            socket.join("room-"+room_n);
            joined =true;
        }
        //this room not empty go to the next room
        else {
            room_n++;
        }
    }

    //s-message
    //Send this event to everyone in the room.
    io.sockets.in("room-"+room_n).emit('connectToRoom', "You are in room no. "+room_n);

    //save the pseudo
    socket.on('new_pseudo', function(pseudo){
        socket.pseudo = pseudo;
        console.log('user choose pseudo :'+socket.pseudo);
    })

    //send the receive msg
    socket.on('send_msg', function(message) {
        message = socket.pseudo+' : '+message; // on ajoute le pseudo
        console.log( message);
        io.emit('receive_msg',message);
    });
});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

// Function
function guidGenerator() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function findRooms() {
    var availableRooms = [];
    var rooms = io.sockets.adapter.rooms;
    if (rooms) {
        for (var room in rooms) {
            if (!rooms[room].hasOwnProperty(room)) {
                availableRooms.push(room);
            }
        }
    }
    return availableRooms;
}
