"use strict";

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    COUNTDOWN: 4,
};

export default class Background {

    
    constructor (game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.background = document.getElementById("background");
        this.loopCount = 0;
        this.windowPicture = document.getElementById("window");
        this.windowPosition = {x: 700, y: 225};
        this.leftWallPosition = {x: 0, y: 74};
        this.leftWallWidth = 70;
    }

    update(deltaTime) {
        this.loopCount ++;
        this.windowPosition.x -= 2;
        if(this.windowPosition.x < -100) this.windowPosition.x = 800;
        if(this.game.gamestate == GAMESTATE.RUNNING) {
            this.leftWallPosition.x -= 15;
        }
    }

    reset() {
        this.loopCount = 0;
        this.windowPosition.x = 700;
    }

    draw(ctx) {
        /*ctx.fillStyle = "#696969";
        ctx.fillRect(0,0,800,75);
        ctx.fillRect(0,this.gameHeight - 75,800,75);
        ctx.fillStyle = "#D3D3D3";
        ctx.fillRect(0,75,800,450);*/
        ctx.drawImage(this.background,0,0,800,600);
        ctx.drawImage(this.windowPicture, this.windowPosition.x, this.windowPosition.y, 100, 100);
        if(this.game.gamestate == GAMESTATE.COUNTDOWN) {
            this.leftWallPosition.x = 0;
        }
        if(this.leftWallPosition.x + this.leftWallWidth > 0) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(this.leftWallPosition.x, this.leftWallPosition.y, this.leftWallWidth, 452);
        } 
    }
}