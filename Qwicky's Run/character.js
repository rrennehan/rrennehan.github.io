"use strict";

import { detectCollision } from './collisionDetection.js';

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

        this.imageArray = [
            document.getElementById("orangeSmileLeft"),
            document.getElementById("orangeSmileRight"),
            document.getElementById("blueSmileLeft"),
            document.getElementById("blueSmileRight"),
            document.getElementById("orangeFrownLeft"),
            document.getElementById("orangeFrownRight"),
            document.getElementById("blueFrownLeft"),
            document.getElementById("blueFrownRight"),
        ];

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
        this.game.gravityFlipCount ++; 
    }

    flipGravityDown(){
        this.speed = this.maxSpeed;
        this.game.gravityFlipCount ++; 
    }

    swapColor(){
        this.colorState ++;
        if(this.colorState === 2) this.colorState = 0;
        this.lastTimeSwap = this.loopCount;
        this.game.colorSwapCount ++;
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
        this.game.bars.forEach(bar => {
            if(detectCollision(this, bar)) {
                if((this.colorState !== bar.colorState)) {
                    this.game.lives --;
                    this.invincibilityState = 1;
                    this.game.laserSound.currentTime = 0;
                    this.game.laserSound.play();
                    this.lastTimeHit = this.loopCount;
                    if(this.game.lives !== 0) {
                        this.game.bars = [];
                    } else { //end of game
                        this.game.timer.stop();
                        this.game.gamesPlayed ++;
                        this.game.averageTimeRan = (parseFloat(this.game.timer.time.toFixed(3)) + this.game.totalTimeRan) / this.game.gamesPlayed;
                        if(this.game.timer.time > this.game.bestTime) {
                            this.game.bestTime = this.game.timer.time;
                        }
                        this.game.totalTimeRan += parseFloat(this.game.timer.time.toFixed(3));
                    }
                    this.game.intervalSelector = this.game.intervalSpeeds.length - 1;
                }
            }
        });
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
        if(this.loopCount % 10 === 0) {
            this.whichLeg = !this.whichLeg;
        }
    }

    draw(ctx) {
        if(this.flipStatus === 1) {
            this.flipStatus = 0;
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