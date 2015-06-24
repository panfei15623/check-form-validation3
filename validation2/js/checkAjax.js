/**
 * Created by 飞 on 15-3-27.
 */
var express = require('express');
var app = express();
var arrName = ["daiyue","zhonghanliang","linzhiying","mengchen","panfei"];

app.get('/',function(req,res){
    var callback = req.query.callback;
    var inputName = req.query.username;
    var result = null;

    for(var i = 0; i < arrName.length; i++) {
        if(inputName == arrName[i]) {
            result = true;
            break;
        } else {
            result = false;
        }
    }
    res.send(callback + "(" + JSON.stringify({results:result}) + ")");
})
app.listen(3000);