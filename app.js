var express = require("express");
var app = express();

const server = app.listen(8000);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/assets"));
app.set("views", __dirname + "/views"); 
app.set("view engine", "ejs");

var cleanerScore = 0;
var distractorScore = 0;

io.on("connection", function (socket) {
    
    socket.on("dragging", function (moveData) {
        console.log("drag data passed");
        socket.broadcast.emit("moveElement", moveData);
    });

    socket.on("drop", function (moveData) {
        console.log("drop data passed");
        socket.broadcast.emit("moveElement", moveData);
    });


});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/waiting_room", function(req, res) {
    res.render("waiting_room");
});

app.get("/match_summary", function(req, res) {
    res.render("match_summary");
});

app.get("/match_recordings", function(req, res) {
    res.render("match_recordings");
});

app.get("/live_match", function(req, res) {
    res.render("live_match");
});