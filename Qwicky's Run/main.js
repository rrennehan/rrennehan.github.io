import Game from './game.js';

    //ensure link to script in html has type = "module"
    //use relative path format.
    //include extension

let canvas = document.getElementById("gameScreen");

let ctx = canvas.getContext('2d'); //will use a lot. Make a short and simple name

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

//Important: When you redraw on the canvas, everything before is still there
//Creates a burn-in effect for moving objects.
//In this case, the above clearRect will prevent this when reloading


//establish game loop: it does:
/*
    Runs every frame
    Updates all objects
    Redraws in new positions
    Repeats for next frame
*/

let lastTime = 0;

//Don't use a while true loop. While true will run faster on better computers
function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
    ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT); //Reset canvas
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop); //gives us a valid time stamp