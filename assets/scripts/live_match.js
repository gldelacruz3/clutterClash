const socket = io();

var matchTime = 120;
var countdownTime = 10;

document.addEventListener('DOMContentLoaded', function() {
    var clutterElements = document.querySelectorAll(".clutter");

    socket.on("moveElement", function(moveData) {
        document.getElementById(moveData.clutterId).style.left = moveData.x + "px";
        document.getElementById(moveData.clutterId).style.top = moveData.y + "px";
    });

    socket.on("initializeMatch", function(clutter, matchDetails) {
        for (let id in clutter) {
            document.getElementById(id).style.left = clutter[id].x + "px";
            document.getElementById(id).style.top = clutter[id].y + "px";
        }
        for (let id in matchDetails) {
            document.getElementById(id).innerHTML = matchDetails[id];
        }
    });

    socket.on("updateCountdown", function(matchDetails) {
        document.getElementById("countdownTimer").style.display = "block";
        countdownTime = matchDetails["countdownTimer"];
        document.getElementById("countdownTimer").innerHTML = matchDetails["countdownTimer"];
    });
    
    socket.on("updateMatchTimer", function(matchDetails) {
        document.getElementById("countdownTimer").style.display = "none";
        matchTime = matchDetails["matchTimer"];
        document.getElementById("matchTimer").innerHTML = matchDetails["matchTimer"];
        
    });

    socket.on("updateScore", function(matchDetails) {
        console.log(matchDetails);
        document.getElementById("cleanerScore").innerHTML = matchDetails["cleanerScore"];
        document.getElementById("distractorScore").innerHTML = matchDetails["distractorScore"];
    });
    
    clutterElements.forEach(function(element) {
        element.addEventListener('dragstart', function(e) {
            if(matchTime > 0) {
                e.dataTransfer.setDragImage(element, 35, 35);
                e.dataTransfer.dropEffect = 'move';
            }
        });

        element.addEventListener("drag", function(e) {
            if(matchTime > 0) {
                var x = e.clientX - (window.innerWidth-1280)/2 - 35;
                var y = e.clientY - 100 - 35;
                var clutterId = e.target.id;

                if(x > 0 && y > 0) {
                    socket.emit("dragging", {clutterId, x, y});
                }
            }
        });
        
        element.addEventListener('dragend', function(e) {
            if(matchTime > 0) {
                var x = e.clientX - (window.innerWidth-1280)/2 - 35;
                var y = e.clientY - 100 - 35;
                var clutterId = e.target.id;

                var arenaTop = 0;
                var arenaBottom = 660;
                var arenaLeft = 0;
                var arenaRight = 1280;

                y = (y < arenaTop + 45)? arenaTop + 10: y;
                y = (y > arenaBottom - 70)? arenaBottom - 70 : y;
                x = (x < arenaLeft)? arenaLeft : x;
                x = (x > arenaRight - 70)? arenaRight - 70 : x; 
                element.style.left = x + "px";
                element.style.top = y + "px";

                socket.emit("drop", {clutterId, x, y});
            }
        });

    });
});
