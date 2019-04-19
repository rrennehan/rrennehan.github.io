"use strict";

import InputHandler from "./input.js";
import Character from "./character.js";
import Background from "./background.js";
import Bar from "./bar.js";
import Timer from "./timer.js"

//import { buildLevel, level1, level2 } from "./levels.js";

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    COUNTDOWN: 4,
    //NEWLEVEL: 4,
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.playArea = document.getElementById("gameScreen");
        
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gamestate = GAMESTATE.MENU;

        this.character = new Character(this);
        this.background = new Background(this);
        this.timer;
        this.bars = [];
        this.lives = 3;
        this.level = 1;
        this.gameObjects = [];
        new InputHandler(this.character, this);
        
        this.loopCount = 0; //Currently unused
        this.drawCount = 0; //Used for heart pulse effect

        this.intervalSpeeds = [40,60,80,100]; //Used for timing of bars
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0; //Used for timing of bars
        this.barUpdateTime = 0; //Used for timing of bars
        
        this.lastLife = false; //Used to start heat beat sound and ensure it only starts once

        this.gameTheme = document.getElementById("gameTheme");
        this.heartBeat = document.getElementById("heartBeat");
        this.countdown = document.getElementById("countdown");
        this.laserSound = document.getElementById("laserSound");

        this.gameTheme.volume = 0;
        this.heartBeat.volume = 0;
        //this.gameTheme.play();
        //this.heartBeat.play();

        

        
        //this.levels = [level1, level2];
        //this.currentLevel = 0;
    }

    start() {
        //if(this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.GAMEOVER) return;

        console.log(document.hidden);

        this.gamestate = GAMESTATE.RUNNING;
        this.timer = new Timer(this);
        this.lives = 3;
        this.lastLife = false;
        this.gameTheme.currentTime = 0;
        this.heartBeat.currentTime = 0;
        this.gameTheme.play();
        this.gameTheme.volume = 1;
        this.heartBeat.play();
        this.heartBeat.volume = 0;
        this.gameTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        this.heartBeat.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }

    reset() {
        this.bars = [];
        this.intervalSpeeds = [40,60,80,100];
        this.level = 1;
        this.gameTheme.pause();
        this.gameTheme.currentTime = 0;
        this.heartBeat.pause();
        this.heartBeat.currentTime = 0;
        this.character.reset();
        this.background.reset();
        this.loopCount = 0;
        this.lives > 0 ? this.gamestate = GAMESTATE.MENU : this.gamestate = GAMESTATE.GAMEOVER; 
    }

    update(deltaTime) {
        
        if(this.gamestate === GAMESTATE.RUNNING) {
            //Game updates

            if(this.timer.time > 10 && this.level === 1) {
                this.level = 2;
                this.intervalSpeeds = [40,50,60,80];
            }

            if(this.timer.time > 20 && this.level === 2) {
                this.level = 3;
                this.intervalSpeeds = [20,40,50,60];
            }

            if(this.timer.time > 30 && this.level === 3) {
                this.level = 4;
                this.intervalSpeeds = [10,20,40,50];
            }
            if(this.timer.time > 60 && this.level === 4) {
                this.level = 5;
                this.intervalSpeeds = [10,10,20,40];
            }
            
            if(this.lives < 1) { //Cause a game over
                this.reset();
                return;
            }
              
            this.loopCount ++;
            this.barUpdateTime ++;

            
            if(this.lives === 1 && !this.lastLife) {
                this.lastLife = true;
                this.gameTheme.volume = 0.6;
                this.heartBeat.volume = 1; 
            }

            //class updates
            this.character.update(deltaTime);
            this.bars.forEach((bar) => {
                bar.update(deltaTime);
            });
            this.bars = this.bars.filter(bar => !bar.markedForDeletion);
            this.bars = this.bars.filter(bar => bar.position.x > 0);
            if(this.character.invincibilityState !== 1) {
                this.bars = [];
                this.intervalSelector = this.intervalSpeeds.length - 1;
            } 
            if(this.barUpdateTime % (this.intervalSpeeds[this.intervalSelector] * this.character.invincibilityState) === 0) {
                this.character.invincibilityState = 1;
                this.bars.push(new Bar(this));
                this.bars[this.bars.length-1].setColor();
                this.updateInterval();
                this.barUpdateTime = 0;
            }
            this.timer.update(deltaTime);
            this.background.update(deltaTime);
        }
    }

    draw(ctx) {
        this.background.draw(ctx);
        this.character.draw(ctx);
        if(this.gamestate === GAMESTATE.RUNNING) {
            this.timer.draw(ctx);
            for(let i = 0; i < this.lives; i++) {
                if(this.lives === 1) {
                    this.drawCount ++;
                    if(this.drawCount === 25) {
                        ctx.drawImage(document.getElementById("heart"), 0, 0, 50+this.drawCount, 50+this.drawCount);
                        this.drawCount = 0;
                    }
                    else{
                        ctx.drawImage(document.getElementById("heart"), i * 50 + 10, 10, 50, 50);
                    }
                }
                else{
                    ctx.drawImage(document.getElementById("heart"), i * 50 + 10, 10, 50, 50);
                }
            }
            this.bars.forEach((bar) => bar.draw(ctx));
        }
        
        if(this.gamestate === GAMESTATE.MENU) {
            
            ctx.rect(0,0,this.gameWidth,this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();

            ctx.drawImage(document.getElementById("gameLogo"),  150, 75, 500, 150);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Press ENTER to Start", this.gameWidth /2, this.gameHeight / 2);
            ctx.font = "20px Arial";
            ctx.fillText("Controls:", this.gameWidth / 2, this.gameHeight / 2 + 40);
            ctx.fillText("Space Bar: Swap Color", this.gameWidth / 2, this.gameHeight / 2 + 80);
            ctx.fillText("Up and Down arrows: Swap Gravity", this.gameWidth / 2, this.gameHeight / 2 + 120);
            ctx.font = "15px Arial";
            ctx.fillText("Music by Hige Driver", this.gameWidth / 2, this.gameHeight / 2 + 160);
        }

        if(this.gamestate === GAMESTATE.GAMEOVER) {
            ctx.rect(0,0,this.gameWidth,this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();

            ctx.drawImage(document.getElementById("gameLogo"),  150, 75, 500, 150);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText('Game over', this.gameWidth /2, this.gameHeight / 2);
            ctx.fillText(`You survived for ${this.timer.time.toFixed(3)} seconds`, this.gameWidth /2, this.gameHeight / 2 + 40);
            ctx.fillText('Press ENTER to retry', this.gameWidth /2, this.gameHeight / 2 + 80);
        }

        if(this.gamestate === GAMESTATE.COUNTDOWN) {
            this.lives = 3;
            this.bars.forEach((bar) => bar.draw(ctx));
            if(this.loopCount >= 0 && this.loopCount < 20) {
                ctx.drawImage(document.getElementById("countdown3"), this.gameWidth / 2 - 25, this.gameHeight / 2 - 100, 50, 100);
            }
            else if(this.loopCount >= 20 && this.loopCount < 40) {
                ctx.drawImage(document.getElementById("countdown2"), this.gameWidth / 2 - 25, this.gameHeight / 2 - 100, 50, 100);
            }
            else if(this.loopCount >= 40 && this.loopCount < 60) {
                ctx.drawImage(document.getElementById("countdown1"), this.gameWidth / 2 - 25, this.gameHeight / 2 - 100, 50, 100);
            }
            else if(this.loopCount >= 60 && this.loopCount < 80) {
                ctx.drawImage(document.getElementById("countdownGo"), this.gameWidth / 2 - 75, this.gameHeight / 2 - 100, 150, 100);
            }
            this.loopCount ++;
            if(this.loopCount >= 80) {
                this.start(); 
                this.gamestate = GAMESTATE.RUNNING;
                this.loopCount = 0;
            } 
        }
    }

    updateInterval() {
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0;
    }
}
