'use strict'

var sockets = [],
    user_data = [],
    arraydiff = require('array-difference')

// --- ez majd nem igy kell ---   
var request = require("request");
//  --------------------------


module.exports = (io) => {

    var socketnumber = 0;
    
    io.on('connection', function(socket){
        console.log('connected');
        var interval;
        
        socket.on('register', function(msg){
            msg = JSON.parse(msg)
            sockets.push(socket)
            msg.id += socketnumber
            socketnumber++
            user_data.push(msg)
            console.log('new user', msg.id +" --- "+ msg.house_ids);
            clearInterval(interval);
            interval = setInterval(interval_notification,5000);
        });
        
        socket.on('disconnect', function () {
            socketnumber--
            delete sockets[socketnumber]
            console.log('diconnected', socketnumber);
            clearInterval(interval);
            interval = setInterval(interval_notification,5000);
        });
       
          
    });
    
    function interval_notification(){
        var index = 0;
        sockets.forEach(function(s){
            //({name: 'Pista' ,  age:85 },[{ name: 'John', age:30 },{ name: 'Pista', age:35 },{ name: 'Sarah', age: 50 }]))
            // irjam meg a salyat diff fugvenyem
            user_data[index].house_ids.forEach(function(house_id){
                request("https://allamvizsga-akoszsebe.c9users.io/getdeviceswithsettings?house_id="+house_id, function(error, response, body) {
                    var olddata  = [];
                    var newdata  = [];
                    JSON.parse(body).forEach(function(item){
                        olddata.push(item.original_value)
                    })
                    setTimeout(function(){
                        request("https://allamvizsga-akoszsebe.c9users.io/getdeviceswithsettings?house_id="+house_id, function(error, response, body) {
                            
                            JSON.parse(body).forEach(function(item){
                                newdata.push(item.original_value)
                            })
                            var diff = arraydiff(olddata,newdata)
                            console.log(olddata,newdata,'diff = ',diff)
                            var returndata = []
                            diff.forEach(function(d){
                                JSON.parse(body).forEach(function(n){
                                            console.log('iiiiiii----------- ',n.original_value,d)
                                          if (n.original_value == d)
                                          returndata.push(n)
                                })
                            })
                            console.log('---------------------- turned on device ',returndata)
                            if (returndata.length > 0) s.emit('notification', JSON.stringify(returndata));
                        
                        })
                    },5000)
                    
                });
            })
            index++
        })
    }
}