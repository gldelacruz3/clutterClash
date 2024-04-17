var express = require("express");
var app = express();

app.use(express.static(__dirname + "/assets"));
app.set("views", __dirname + "/views"); 
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/waiting_room", function(req, res) {
    res.render("waiting_room");
});



app.listen(8000, function() {
    console.log("Listening to Port 8000");
});