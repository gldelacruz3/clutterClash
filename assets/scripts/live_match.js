const socket = io();



document.addEventListener('DOMContentLoaded', function() {
    var clutterElements = document.querySelectorAll(".clutter");

    console.log(clutterElements);
    
    clutterElements.forEach(function(element) {
        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setDragImage(element, 35, 35);
            e.dataTransfer.dropEffect = 'move';
        });
        
        element.addEventListener('dragend', function(e) {
            var x = e.clientX - (window.innerWidth-1280)/2 - 35;
            var y = e.clientY - 100 - 35;
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
        });
    });
});
