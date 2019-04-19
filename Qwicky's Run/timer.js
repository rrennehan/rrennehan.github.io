"use strict";

export default class Timer {

    constructor (game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.time = 0;
    }

    update(deltaTime) {
        this.time += parseFloat((deltaTime/1000).toFixed(3));
        this.time = parseFloat(this.time.toFixed(3));
    }

    draw(ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(200,12.5,175,50);

        ctx.fillStyle = "#000000";
        ctx.font='23px Arial';
        ctx.textAlign = "right";
        
        ctx.fillText(`${this.time.toFixed(1)} seconds`, 715/2,90/2, 175);
    }
}