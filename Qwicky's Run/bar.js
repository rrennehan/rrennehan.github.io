"use strict";

//black bars now refer to spikes
export default class Bar {

    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.position = {x: this.gameWidth, y: 75};
        this.speed = 10;
        this.maxSpeed = 15;
        this.width = 10;
        this.height = 450;
        this.colors = ["#e56b29", "#3351f7", "#000000"]; //Add black
        this.colorGenerator = Math.floor(Math.random() * 100) + 1;  // returns a random integer from 1 to 100
        this.colorState;
    }

    setColor() {
        if(this.game.level <= 2) {
            if(this.colorGenerator < 50) this.colorState = 0;
            if(this.colorGenerator >= 50) this.colorState = 1;
        }
        else {
            if(this.colorGenerator < 45) this.colorState = 0;
            if(this.colorGenerator >= 45 && this.colorGenerator < 90) this.colorState = 1;
            if(this.colorGenerator >= 90) {
                let existingBlackBar = this.game.bars.find(bar => {
                    return bar.colorState === 2;
                });
                if(existingBlackBar == undefined) { //Make a black bar to gravity flip over
                    this.colorState = 2;
                    this.width = 1600;
                    if(this.colorGenerator <= 94) { //On ceiling
                        this.height = 30;
                    }
                    else {
                        this.height = 30;
                        this.position.y = 495;
                    }
                } 
                else { //Do not make a black bar if one already exists
                    this.colorState = 1;
                } 
            } 
        }
       
    }

    rotateAndPaintImage (context, image, angleInRad, positionX, positionY, axisX, axisY) {
        context.translate( positionX, positionY );
        context.rotate( angleInRad );
        context.drawImage( image, -axisX, -axisY, axisX, axisY );
        context.rotate( -angleInRad );
        context.translate( -positionX, -positionY );
      }

    update(deltaTime) {
        this.position.x -= this.speed;
    }

    draw(ctx) {
        if(this.colorState === 0 || this.colorState === 1) {
            ctx.fillStyle = this.colors[this.colorState];
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        else {
            if(this.colorGenerator <= 94) this.rotateAndPaintImage(ctx, document.getElementById("spikes"), 180*Math.PI/180, this.position.x, this.position.y, this.width, this.height);
            else ctx.drawImage(document.getElementById("spikes"), this.position.x, this.position.y, this.width, this.height);
        }
    }
}