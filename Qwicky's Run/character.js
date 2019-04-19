"use strict";

import { detectCollision } from './collisionDetection.js';

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4,
};

export default class Character {

    constructor(game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.position = {x: 80, y: 475};
        this.speed = 15;
        this.maxSpeed = 15;
        this.colors = ["#e56b29", "#3351f7"];
        this.colorState = 0;
        this.invincibilityState = 1;
        this.flipStatus = 0;

        this.size = {width: 50, height: 75};
        this.position = {x: 80, y: 525-this.size.height};

        this.image0 = document.getElementById("orangeSmileLeft");
        this.image1 = document.getElementById("orangeSmileRight");
        this.image2 = document.getElementById("blueSmileLeft");
        this.image3 = document.getElementById("blueSmileRight");
        this.image4 = document.getElementById("orangeFrownLeft");
        this.image5 = document.getElementById("orangeFrownRight");
        this.image6 = document.getElementById("blueFrownLeft");
        this.image7 = document.getElementById("blueFrownRight");

        this.imageArray = [this.image0, this.image1, this.image2, this.image3, this.image4, this.image5, this.image6, this.image7];
        this.imageSelector = 0;

        this.loopCount = 0;
        this.lastTimeHit = 0;

        this.whichLeg = true; //left leg currently touching ground

    }

    readyToFlip() {
        this.flipStatus = 1;
    }

    flipGravityUp(){
        this.speed = -this.maxSpeed;  
    }

    flipGravityDown(){
        this.speed = this.maxSpeed;
    }

    swapColor(){
        this.colorState ++;
        if(this.colorState === 2) this.colorState = 0;
        this.lastTimeSwap = this.loopCount;
    }

    reset() {
        this.loopCount = 0;
        this.lastTimeHit = 0;
        this.lastTimeSwap = 0;

        this.speed = 15;
        this.maxSpeed = 15;
        
        this.colorState = 0;
        this.invincibilityState = 1;
        this.flipStatus = 0;

        this.size = {width: 50, height: 75};
        this.position = {x: 80, y: 525-this.size.height};

    }

    rotateAndPaintImage (context, image, angleInRad, positionX, positionY, axisX, axisY) {
        context.translate( positionX, positionY );
        context.rotate( angleInRad );
        context.drawImage( image, -axisX, -axisY, axisX, axisY );
        context.rotate( -angleInRad );
        context.translate( -positionX, -positionY );
      }

    update(deltaTime) {
        this.loopCount ++;
        if(this.flipStatus === 1) {
            if(this.position.y === 525 - this.size.height) {
               this.flipGravityUp();
               this.flipStatus = 0;
            } 
            else if(this.position.y === 75) {
              this.flipGravityDown();
              this.flipStatus = 0;
            } 
        }
        this.position.y += this.speed;
        if(this.position.y < 75) {
            this.position.y = 75;
            
        }
        if(this.position.y > 525 - this.size.height) {
            this.position.y = 525 - this.size.height;
            
        }

        this.game.bars.forEach(bar => {
            if(detectCollision(this, bar)) {
                if((this.colorState !== bar.colorState)) {
                    this.game.lives --;
                    bar.markedForDeletion = true;
                    this.invincibilityState = 2;
                    this.game.laserSound.currentTime = 0;
                    this.game.laserSound.play();
                    this.lastTimeHit = this.loopCount;
                }
            }
        });
    }

    draw(ctx) {
        if(this.flipStatus === 1) {
            this.flipStatus = 0;
        } 

        if(this.game.gamestate === GAMESTATE.RUNNING) {
            if(this.loopCount % 10 === 0) {
                this.whichLeg = !this.whichLeg;
            }
        }

        this.imageSelector = 0;
        this.imageSelector += 2 * this.colorState; // 2 or 0
        if(!this.whichLeg) {
            this.imageSelector += 1;
        }
        
        if(this.loopCount - this.lastTimeHit < 60 && this.lastTimeHit !== 0 || this.game.lives <= 1) { //add frown
            this.imageSelector += 4;
        }
        

        if(this.speed > 0) {    
            ctx.drawImage(this.imageArray[this.imageSelector], this.position.x, this.position.y, this.size.width, this.size.height);
            //if(smile)
        }
        else if(this.speed < 0) {
            this.rotateAndPaintImage(ctx, this.imageArray[this.imageSelector], 180*Math.PI/180, this.position.x, this.position.y, this.size.width, this.size.height);
        }

        
    }

}