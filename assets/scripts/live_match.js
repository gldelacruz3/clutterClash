document.addEventListener('DOMContentLoaded', function() {
    var clutterElements = document.querySelectorAll(".clutter");

    console.log(clutterElements);
    
    clutterElements.forEach(function(element) {
        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setDragImage(element, 35, 35);
            e.dataTransfer.dropEffect = 'move';
        });
        element.addEventListener('dragend', function(e) {
            var x = e.clientX - 35;
            var y = e.clientY - 35;
            var arenaTop = 100;
            var arenaBottom = 760;
            var arenaLeft = (window.innerWidth-1280)/2;
            var arenaRight = (window.innerWidth-1280)/2 + 1280;


            y = (y < arenaTop)? arenaTop : y;
            y = (y > arenaBottom - 70)? arenaBottom - 70 : y;
            x = (x < arenaLeft)? arenaLeft : x;
            x = (x > arenaRight - 70)? arenaRight - 70 : x; 
            element.style.left = x + "px";
            element.style.top = y + "px";
        });
    });
});
