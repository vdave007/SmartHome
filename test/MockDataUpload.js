var request = require("request");

var v1 = 2100,
    v2 = 7450,
    v3 = 0,
    v4 = 4000,
    i = 0,j = 0;

function UploadData() {
    if (i < 10)
    {
        v1 = 0
        v2 += 5
        v3 =  0
        v4 += 5
        i++;
    }else if (j < 10)
    {
        v1 = 0
        v2 -= 5
        v3 = 6000 
        v4 -= 5
        j++;
    }
    else {i=0;j=0;}
    
    // request("https://allamvizsga-akoszsebe.c9users.io/saveRawData?cid=69&v1="+v1+"&v2="+v2+"&v3="+v3+"&v4="+v4, function(error, response, body) {
    //     console.log(body);
    // });
    console.log("Feltolt");
    request({
    url: "http://localhost:8080/device/saveRawData",
    method: "POST",
    headers: {
        // header info - in case of authentication enabled
    },
    json:{
        cid: '7ad7-faeb-ab847b',
        v1 : v1,
        v2 : v2,
        v3 : v3,
        v4 : v4
    }, function(err, res, body){
        if(!err){
            // do your thing
        }else{
            // handle error
        }
    }});
}




setInterval(UploadData,5000);