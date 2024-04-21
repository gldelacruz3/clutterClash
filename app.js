var express = require("express");
var app = express();

const server = app.listen(8000);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/assets"));
app.set("views", __dirname + "/views"); 
app.set("view engine", "ejs");

var clutter = {
    "clutter1": { x: 57, y: 260 },
    "clutter2": { x: 57, y: 390 },
    "clutter3": { x: 57, y: 520 },
    "clutter4": { x: 475, y: 275 },
    "clutter5": { x: 600, y: 275 },
    "clutter6": { x: 725, y: 275 },
    "clutter7": { x: 740, y: 50 },
    "clutter8": { x: 961, y: 40 },
    "clutter9": { x: 1098, y: 40 },
    "clutter10": { x: 1162, y:515 },
    "clutter11": { x: 262, y: 130 },
    "clutter12": { x: 262, y: 260 },
    "clutter13": { x: 262, y: 390 },
    "clutter14": { x: 262, y: 520 },
    "clutter15": { x: 475, y: 538 },
    "clutter16": { x: 600, y: 538 },
    "clutter17": { x: 725, y: 538 },
    "clutter18": { x: 961, y: 228 },
    "clutter19": { x: 1098, y: 228 },
    "clutter20": { x: 966, y: 515 }
};

startMatch();

io.on("connection", function (socket) {
    socket.emit("initializeClutter", clutter);
    
    
    socket.on("dragging", function (moveData) {
        clutter[moveData.clutterId].x = moveData.x;
        clutter[moveData.clutterId].y = moveData.y;
        socket.broadcast.emit("moveElement", moveData);
    });

    socket.on("drop", function (moveData) {
        clutter[moveData.clutterId].x = moveData.x;
        clutter[moveData.clutterId].y = moveData.y;
        socket.broadcast.emit("moveElement", moveData);
        updateScore();
    });
});

function updateScore() {
    let cleanerScore = 0;
    let distractorScore = 0;
    for (let id in clutter) {
        let x = clutter[id].x;
        let y = clutter[id].y;
        if((x >= 10 && x <= 210 && y >= 165) || (x >= 665 && x <= 850 && y <= 126) || (x >= 385 && x <= 850 && y > 126 && y <= 496) || (x >= 860 && x <= 1270 && y <= 175) || (x >= 1088 && x <= 1270 && y >= 415 && y <= 650)) {
            cleanerScore += 1; 
        } else {
            distractorScore += 1;
        }
    }
    cleanerScore = (cleanerScore - 10 < 0)? 0: cleanerScore - 10;
    distractorScore = (distractorScore - 10 < 0)? 0: distractorScore - 10;
    console.log(cleanerScore + " | " + distractorScore);
}

function startMatch() {
    let matchDuration = 15;
    let intervalId = setInterval(function() {
            matchDuration = matchDuration - 1;
            io.emit("updateMatchTimer", matchDuration);
            if (matchDuration == 0) {
                clearInterval(intervalId);
            } 
        }, 1000
    );
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