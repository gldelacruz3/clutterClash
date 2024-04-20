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
        socket.broadcast.emit("moveElement", moveData);
    });

    socket.on("drop", function (moveData) {
        socket.broadcast.emit("moveElement", moveData);

    });


});

function updateScore(moveData) {
    let x = moveData.x;
    let y = moveData.y;

    if((x >= 10 && x <= 210 && y >= 165) || (x >= 665 && x <= 850 && y <= 126) || (x >= 385 && x <= 850 && y > 126 && y <= 496) || (x >= 860 && x <= 1270 && y <= 175) || (x >= 1088 && x <= 1270 && y >= 450 && y <= 650)) {
        cleanerScore += 1;    
    } else {
        distractorScore += 2;
    }
    console.log(cleanerScore + " | " + distractorScore);
}

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