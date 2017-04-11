'use strict'


module.exports = (io) => {

    var socketnumber = 0;
    
    io.on('connection', function(socket){
        console.log('connected', ++socketnumber);
        
        socket.on('chat message', function(msg){
            console.log('chat message', msg);
        });
        
        socket.on('disconnect', function () {
            socketnumber--
            console.log('diconnected', socketnumber);
        });
          
    });
}