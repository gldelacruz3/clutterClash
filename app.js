var express = require("express");
const session = require('express-session');
const flash = require("express-flash");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex');

var app = express();

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}))

app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));

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

var matchDetails = {
    "cleanerName": null,
    "distractorName":null,
    "cleanerScore": 0,
    "distractorScore": 0,
    "matchTimer": 120,
    "countdownTimer": 10
}

var cleanerReady = false;
var distractorReady = false;
var countdownStarted = false;

io.on("connection", function (socket) {
    socket.emit("initializeMatch", clutter, matchDetails);  
    
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

    socket.on("cleanerReady", function() {
        cleanerReady = true;
        if(distractorReady == true) {
            io.emit("redirect", "/live_match");
            if(countdownStarted == false) {
                startCountdown();
                countdownStarted = true;
            }
            
        }
    });

    socket.on("distractorReady", function() {
        distractorReady = true;
        if(cleanerReady == true) {
            io.emit("redirect", "/live_match");
            if(countdownStarted == false) {
                startCountdown();
                countdownStarted = true;
            }
        }
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
    matchDetails["cleanerScore"] = (cleanerScore - 10 < 0)? 0: cleanerScore - 10;
    matchDetails["distractorScore"] = (distractorScore - 10 < 0)? 0: distractorScore - 10;
    io.emit("updateScore", matchDetails);
}

function startCountdown() {
    let intervalId = setInterval(function() {
        matchDetails["countdownTimer"] -= 1;
            io.emit("updateCountdown", matchDetails);
            if (matchDetails["countdownTimer"] == 0) {
                startMatch();
                clearInterval(intervalId);
            }
        }, 1000
    );
}

function startMatch() {
    let intervalId = setInterval(function() {
            matchDetails["matchTimer"] -= 1;
            io.emit("updateMatchTimer", matchDetails);
            if (matchDetails["matchTimer"] == 0) {
                clearInterval(intervalId);
            } 
        }, 1000
    );
}

app.get("/", function(req, res) {
    res.render("index", { messages: req.flash() });
});

app.post("/", (req, res) => {
    const username = req.body.username;
    if (matchDetails["cleanerName"] == null) {
        matchDetails["cleanerName"] = username;
        req.session.username = username;
        req.session.player = true;
        res.redirect("/waiting_room");
    } else if (matchDetails["distractorName"]==null) {
        matchDetails["distractorName"] = username;
        req.session.username = username;
        req.session.player = true;
        res.redirect("/waiting_room");
    } else {
        req.flash("error", "Match is ongoing, try again later.");
        res.redirect("/")
    }
});

app.get("/waiting_room", function(req, res) {
    res.render("waiting_room", { matchDetails: matchDetails });
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