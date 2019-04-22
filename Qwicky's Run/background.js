"use strict";

const GAMESTATE = {
    COUNTDOWN: 1,
    RUNNING: 2,
    GAMEOVER: 3,
    MENU: 4,
    INSTRUCTIONS: 5,
    LEADERBOARDS: 6,
    ACHIEVEMENTS: 7,
    STATS: 8,
    CREDITS: 9, 
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
        this.leftWallPosition.x = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.background,0,0,800,600);
        ctx.drawImage(this.windowPicture, this.windowPosition.x, this.windowPosition.y, 100, 100);
        if(this.leftWallPosition.x + this.leftWallWidth > 0) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(this.leftWallPosition.x, this.leftWallPosition.y, this.leftWallWidth, 452);
        } 
    }
}