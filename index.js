var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
const redis = require('socket.io-redis');
io.adapter(redis({ host: '127.0.0.1', port: 6379 }));
var jwt = require('jsonwebtoken');
var Request = require("request");

// Routing
app.use(express.static(path.join(__dirname, 'public')));

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    
   /* Request.get({
      "headers": {"Authorization":socket.handshake.query.token },
      "url": "http://localhost:8080/openintl-api-security/v1/auth/validate"      
      }, (error, response, body) => {
      if(error) {
          return next(new Error('Authentication error'));;
      }
      if(body === ""){
        console.log('User NOT connected');
        return next(new Error('Authentication error'));
      }
        next();      
  });    */
  }
  next();
  //next(new Error('Authentication error'));
})
.on('connection', function(socket){
  //socket.setTimeout(3000);
  socket.on('timeout', () => {
    console.log('socket timeout');
    //socket.end();
  });


  var logoffTimer;
  socket.on('change group', function(data){
	console.log('User connected ' || data.message);
    socket.join(data.room);
    io.to(data.room).emit('chat message', data.message);	

    /**
     *  Implementacion 1 del timeout
     */

    // Timeout
        // clear the timer on activity
        // should also update activity timestamp in session
        //clearTimeout(logoffTimer);
        // set a timer that will log off the user after 15 minutes
        /*logoffTimer = setTimeout(function(){
            // add log off logic here
            // you can also check session activity here
            // and perhaps emit a logoff event to the client as mentioned
            socket.emit("disconnect", { reason: "Logged off due to inactivity" });
        }, 60 * 15);    */

    /**
     *  Implementacion 2 del timeout
     */

    

  });

  socket.on('chat message', function(data) {
    console.log(data.room+"-"+data.message);
    io.to(data.room).emit('chat message',data.message);	
    var arr = data.message.split(": ");
    var jsonDataObj = {order: data.room, user: arr[0], message:arr[1]};


    /*Request.post({
      headers: {"Authorization":socket.handshake.query.token,'content-type':'application/json' },
      url: "http://localhost:8080/openintl-api-security/v1/chat/save",
      body: JSON.stringify(jsonDataObj)

      }, (error, response, body) => {
      });*/

      
      /*if(error) {
          return next(new Error('Authentication error'));;
      }
      if(body === ""){
        console.log('User NOT connected');
        return next(new Error('Authentication error'));
      }*/
      
  }); 
  


  socket.on('disconnect', function () {
    console.log('disconnected event -->'+socket.handshake.query.order);
    //var jsonDataObj = {idOrden: socket.handshake.query.order};
    /*Request.post({
      headers: {"Authorization":socket.handshake.query.token,'content-type':'application/json' },
      url: "http://localhost:8080/openintl-api-security/v1/chat/end",
      body: socket.handshake.query.order

      }, (error, response, body) => {
      });*/    
    //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
    socket.disconnect(); //--> same here
  }); 
   
});
 

http.listen(3001, function(){
  console.log('listening on *:3001');
});