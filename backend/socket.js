'use strict'

var sockets = [],
    arraydiff = require('array-difference')

// --- ez majd nem igy kell ---   
var request = require("request");
//  --------------------------

module.exports = (io) => {

    var socketnumber = 0;

    var interval;
    
    
    io.on('connection', function(socket){
        console.log('connected');
        socketnumber++

        
        socket.on('register', function(msg){
            console.log(msg);
            msg = JSON.parse(msg)
            if (sockets.length == 0)
                {
                    console.log("null socket szam");
                    socket.user_data = msg;
                    sockets.push(socket)
                    console.log('new user',msg.guid +" --- "+ msg.house_ids);
                }
            else 
                sockets.forEach(function(item) {
                    if (item.user_data.guid.toString().trim() === msg.guid.toString().trim()){
                        console.log("egal");
                        //socket.disconnect();
                    }
                    else 
                    {
                        console.log("nem egal");
                        socket.user_data = msg;
                        sockets.push(socket)
                
                        console.log('new user',msg.guid +" --- "+ msg.house_ids);
                    }
            });
            
            clearInterval(interval);
            interval = setInterval(interval_notification,5000);
        });
        
        socket.on('disconnect', function () {
            socketnumber--
            socket.disconnect();
            delete sockets.pop(socket)
            console.log('diconnected', socketnumber);
            clearInterval(interval);
            interval = setInterval(interval_notification,5000);
        });
       
          
    });
    
    function interval_notification(){
        sockets.forEach(function(s){
            s.user_data.house_ids.forEach(function(house_id){
                request("https://allamvizsga-akoszsebe.c9users.io/api/getdeviceswithsettings?house_id="+house_id, function(error, response, body) {
                    var olddata  = [];
                    var newdata  = [];
                    JSON.parse(body).forEach(function(item){
                        olddata.push(item.original_value)
                    })
                    setTimeout(function(){
                        request("https://allamvizsga-akoszsebe.c9users.io/api/getdeviceswithsettings?house_id="+house_id, function(error, response, body) {
                            
                            JSON.parse(body).forEach(function(item){
                                newdata.push(item.original_value)
                            })
                            var diff = arraydiff(olddata,newdata)
                            console.log(olddata,newdata,'diff = ',diff)
                            var returndata = []
                            diff.forEach(function(d){
                                JSON.parse(body).forEach(function(n){
                                            console.log('iiiiiii----------- ',n.original_value,d)
                                          if (n.original_value == d && n.icon_id != 0)
                                          returndata.push(n)
                                })
                            })
                            console.log('---------------------- turned on device ',returndata)
                            if (returndata.length > 0) s.emit('notification', JSON.stringify(returndata));
                        
                        })
                    },5000)
                    
                });
            })
           // console.log('iiiiiii----------- ',sockets.length,s.user_data.house_ids)
        })
    }
}