const express = require('express');
const app = express();
const http = require('http').Server(app);
//const io = require('socket.io')(http);
const socketIO = require('socket.io');



//app.get('/', function(req, res) {
//    res.render('index.ejs');
//});
const PORT = process.env.PORT || 3000;
//const INDEX = path.join("/views", 'index.ejs');

const server = express()
  .use((req, res) => res.render("index.ejs", { root:"views" }) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);


var online_users = 1
var total_messages = 0
var users = [];

io.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
	console.log(socket.username +" has connected")
	online_users = online_users + 1
	io.sockets.emit('online_users', online_users)
	users.push(socket.username);
	updateClients();
	io.emit('chat_message', '<server>' + "Server" + '</server>: ' + "hey, welcome "+socket.username+"!");
	//var body = window.document.getElementsByIdB("users").innerHTML = online_users;
    });

    socket.on('disconnect', function(username) {
	  if(socket.username != "undefined")
	  {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
	console.log("Disconnected "+ socket.username)
	online_users = online_users - 1
	 // document.getElementById("users").innerHTML = online_users;
	io.sockets.emit('online_users', online_users)    
	for(var i=0; i<users.length; i++) {
            if(users[i] == socket.username) {
                delete users[users[i]];
            }
        }
        updateClients(); 
	  }else{
		online_users = online_users + 1 
		  updateClients(); 
	  }
	    
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
	console.log(socket.username + " said this: "+message)
	//io.emit('chat_message', '<strong>' + "console" + '</strong>: ' + message);
	total_messages = total_messages + 1    
    });

});
 function updateClients() {
        io.sockets.emit('update', users);
    }

//const server = http.listen(8080, function() {
//   console.log('listening on *:8080');
//});


//http.listen((process.env.PORT || 5000), function(){
// console.log('listening on *:5000');
//});
/*server.listen(3000,"https://r4y-message.herokuapp.com/", function() {
  console.log('Listening on port ' + port);
});*/
