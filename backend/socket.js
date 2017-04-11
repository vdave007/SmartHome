'use strict'

var sockets = [],
    user_data = []

// --- ez majd nem igy kell ---   
var request = require("request");
//  --------------------------


module.exports = (io) => {

    var socketnumber = 0;
    
    io.on('connection', function(socket){
        console.log('connected');
        
        
        socket.on('register', function(msg){
            msg = JSON.parse(msg)
            sockets.push(socket)
            msg.id += socketnumber
            socketnumber++
            user_data.push(msg)
            console.log('new user', msg.id +" --- "+ msg.house_id);
        });
        
        socket.on('disconnect', function () {
            socketnumber--
            delete sockets[socketnumber]
            console.log('diconnected', socketnumber);
        });
       
          
    });
    
    setInterval(function(){
        var index = 0;
        sockets.forEach(function(s){
            request("https://allamvizsga-akoszsebe.c9users.io/getdeviceswithsettings?house_id="+user_data[index].house_id, function(error, response, body) {
                console.log(body);
                s.emit('notification', "this is a test  " + body);
            });
            index++
        })
    },5000);
}