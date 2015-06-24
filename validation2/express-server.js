/**
 * Created by mengchen on 2015/3/30.
 */

var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.sendfile("my-validation.html");
});
app.get("/ok.png", function(req, res) {
    res.sendfile("image/ok.png");
});
app.get("/warning.png", function(req, res) {
    res.sendfile("image/warning.png");
});
app.get("/common.css", function(req, res) {
    res.sendfile("css/common.css");
});

//app.get("/my-validate.js", function(req, res) {
//    res.sendfile("my-validate.js");
//});
app.get("/validation-extend.js", function(req, res) {
    res.sendfile("validation-extend.js");
});
app.get("/check", function(req, res) {
    var username = req.query.username;
    console.log("username=" + username);
    var result = (username === "mengchen");
    res.json({result : result});
});

app.listen(8000);