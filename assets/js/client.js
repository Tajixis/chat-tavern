
//s-room
socket.on('connectToRoom', function (room_n) {
    $("#room").html(room_n);
});

//s-message
//when message let s display it in console !
socket.on('message', function (message) {
    console.log(message);
});

//send message now
//submit it s first thing because it s prioritary elmts!
$( "form" ).submit(function( event ) {
    socket.emit('send_msg', $('#textBar').val());
    $('#textBar').val('');
    return false;
});

//receive msg ? let s display it !
socket.on('receive_msg', function(message){
    $('#messages').append($('<li>').text(message));
});

//on connection, ask for pseudo
var pseudo = prompt("Choisi un pseudonyme");
socket.emit('new_pseudo',pseudo);
