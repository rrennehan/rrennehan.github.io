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
            if(this.colorGenerator < 50) {
                this.colorState = 0;
                this.game.colorChain0 ++;
                this.game.colorChain1 = 0;
            }
            else if(this.colorGenerator >= 50) {
               this.colorState = 1;
               this.game.colorChain1 ++; 
               this.game.colorChain0 = 0;
            } 
        }
        else { //Starting at level 3
            if(this.colorGenerator < 40) {
               this.colorState = 0;
               this.game.colorChain0 ++;
               this.game.colorChain1 = 0;
            } 
            else if(this.colorGenerator >= 40 && this.colorGenerator < 80) {
                this.colorState = 1;
                this.game.colorChain1 ++;
                this.game.colorChain0 = 0;
            }
            else if(this.colorGenerator >= 80) {
                let existingBlackBar = this.game.bars.find(bar => {
                    return bar.colorState === 2;
                });
                if(existingBlackBar == undefined) { //Make spikes to gravity flip over
                    this.colorState = 2;
                    this.width = 1600;
                    if(this.colorGenerator < 90) { //Spikes on ceiling
                        this.height = 30;
                    }
                    else { //Spikes on floor
                        this.height = 30;
                        this.position.y = 495;
                    }
                } 
                else { //Do not make spikes if they already exist
                    this.colorState = 1;
                } 
            } 
        }

        //Swap color if too many in a row appear
        if(this.game.colorChain0 - this.game.colorChain1 > 4) {
            this.colorState = 1;
            this.game.colorChain0 = 0;
            this.game.colorChain1 = 0;
        }
        else if(this.game.colorChain1 - this.game.colorChain0 > 4) {
            this.colorState = 0;
            this.game.colorChain0 = 0;
            this.game.colorChain1 = 0;
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
            if(this.colorGenerator < 90 ) this.rotateAndPaintImage(ctx, document.getElementById("spikes"), 180*Math.PI/180, this.position.x, this.position.y, this.width, this.height);
            else ctx.drawImage(document.getElementById("spikes"), this.position.x, this.position.y, this.width, this.height);
        }
    }
}