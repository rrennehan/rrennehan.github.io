"use strict";

import Game from './game.js';

    //ensure link to script in html has type = "module"
    //use relative path format.
    //include extension

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext('2d'); //will use a lot. Make a short and simple name

let offScreenCanvas = document.createElement('canvas');
offScreenCanvas.width = GAME_WIDTH;
offScreenCanvas.height = GAME_HEIGHT;
let offScreenCTX = offScreenCanvas.getContext('2d');

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let hidden = false;
document.addEventListener('visibilitychange', function(e) {
    hidden = true;
});
//Important: When you redraw on the canvas, everything before is still there
//Creates a burn-in effect for moving objects. Use ClearRect to refresh


//establish game loop: it does:
/*
    Runs every frame
    Updates all objects
    Redraws in new positions
    Repeats for next frame
*/

let lastTime = 0;
let deltaTime;
//let times60 = 0;

//Don't use a while true loop. While true will run faster on better computers
function gameLoop(timeStamp) {
    deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;;

    //console.log(`FPS: ${(1000/deltaTime).toFixed(2)}`);
    /*if((1000/deltaTime).toFixed(2) == 60.00) {
        times60 ++;
        console.log(times60);
    }*/
  
    //ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT); Reaches exactly 60.00 FPS more times without this line
    //offScreenCTX.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT); //Reset off screen canvas
    
    game.update(deltaTime);
    game.preRender(offScreenCTX); //prerender on the off screen canvas
    ctx.drawImage(offScreenCanvas, 0, 0, 800, 600); //draw the result onto the on-screen canvas

    requestAnimationFrame(gameLoop);

    if(hidden) { //Reset because the tab was changed
        let sounds = document.getElementsByTagName('audio');
        for(let i=0; i<sounds.length; i++) sounds[i].pause();
        game = new Game(GAME_WIDTH, GAME_HEIGHT);
        hidden = false;
        return;
    } 
}

requestAnimationFrame(gameLoop); //gives us a valid time stamp

/*var m_canvas = document.createElement('canvas');
m_canvas.width = 64;
m_canvas.height = 64;
var m_context = m_canvas.getContext(‘2d’);
drawMario(m_context);

function render() {
  context.drawImage(m_canvas, 0, 0);
  requestAnimationFrame(render);
}
*/