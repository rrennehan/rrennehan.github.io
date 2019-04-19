"use strict";

export default class Background {

    constructor (game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.background = document.getElementById("background");
        this.loopCount = 0;
        this.windowPicture = document.getElementById("window");
        this.windowPosition = {x: 700, y: 225};
    }

    update(deltaTime) {
        this.loopCount ++;
        this.windowPosition.x -= 1;
        if(this.windowPosition.x < -100) this.windowPosition.x = 800;
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
    }
}