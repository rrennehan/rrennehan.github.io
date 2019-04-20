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
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        
        //Initialize game and object variables
        this.playArea = document.getElementById("gameScreen");
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gamestate = GAMESTATE.MENU;

        //Initialize classes
        this.character = new Character(this);
        this.background = new Background(this);
        this.timer;
        this.bars = [];
        this.gameObjects = [];
        new InputHandler(this.character, this);
        
        //Looping
        this.loopCount = 0; //Used to set up timing
        this.drawCount = 0; //Used for heart pulse effect

        //Bar intervals and patterns
        this.intervalSpeeds = [40,60,80,80]; //Used for timing of bars
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0; //Used for timing of bars
        this.barUpdateTime = 0; //Used for timing of bars
        
        //Game factors
        this.lives = 3;
        this.level = 1;
        this.levelUpTime = 0;
        this.lastLife = false; //Used to start heat beat sound and ensure it only starts once

        //Music and sounds
        this.gameTheme = document.getElementById("gameTheme");
        this.heartBeat = document.getElementById("heartBeat");
        this.countdown = document.getElementById("countdown");
        this.laserSound = document.getElementById("laserSound");
        this.levelUpSound = document.getElementById("levelUpSound");
        this.gameTheme.volume = 0;
        this.heartBeat.volume = 0;


        //Initialize localStorage for stats and achievement unlocks
        if(localStorage.getItem("15seconds") === null) {
            localStorage.setItem("15seconds", "false");
        }
        if(localStorage.getItem("30seconds") === null) {
            localStorage.setItem("30seconds", "false");
        }
        if(localStorage.getItem("60seconds") === null) {
            localStorage.setItem("60seconds", "false");
        }
        if(localStorage.getItem("endOfSong") === null) {
            localStorage.setItem("endOfSong", "false");
        }
        if(localStorage.getItem("colorSwapCount") === null) {
            localStorage.setItem("colorSwapCount", "0");
        }
        if(localStorage.getItem("bestTime") === null) {
            localStorage.setItem("bestTime", "0.000");
        }
        this.colorSwapCount = parseInt(localStorage.getItem("colorSwapCount"));
        this.bestTime = parseFloat(localStorage.getItem("bestTime"));

        console.log(`Swapped color ${this.colorSwapCount} out of 100000 times`);
        console.log(`Best time: ${this.bestTime} seconds`);
        if(localStorage.getItem("15seconds") === "true") {
            console.log("15 seconds unlocked!");
        }
        if(localStorage.getItem("30seconds") === "true") {
            console.log("30 seconds unlocked!");
        }
        if(localStorage.getItem("60seconds") === "true") {
            console.log("60 seconds unlocked!");
        }
        if(localStorage.getItem("endOfSong") === "true") {
            console.log("Reached end of song!");
        }

        
        //this.levels = [level1, level2];
        //this.currentLevel = 0;
    }

    start() {
        //if(this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.GAMEOVER) return;
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
            if(localStorage.getItem("endOfSong") === "false") {
                localStorage.setItem("endOfSong", "true");
            }
            this.currentTime = 0;
            this.play();
        }, false);
        this.heartBeat.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        console.log(this.levelUpSound);
    }

    reset() {
        this.bars = [];
        this.intervalSpeeds = [40,60,80,80];
        this.level = 1;
        this.levelUpTime = 0;
        this.character.reset();
        this.background.reset();
        this.loopCount = 0;
    }

    update(deltaTime) {
        
        if(this.gamestate === GAMESTATE.RUNNING) {
            
            //Game updates
            if(this.lives < 1) { //Cause a game over
                this.gameTheme.pause();
                this.gameTheme.currentTime = 0;
                this.heartBeat.pause();
                this.heartBeat.currentTime = 0;
                this.gamestate = GAMESTATE.GAMEOVER;
                return;
            }

            if(this.lives === 1 && !this.lastLife) {
                this.lastLife = true;
                this.gameTheme.volume = 0.6;
                this.heartBeat.volume = 1; 
            }

            this.loopCount ++;
            this.barUpdateTime ++;

            //Timer functions
            
            //Change levels
            if(this.timer.time > 10 && this.level === 1) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 2;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [40,50,60,60];
            }

            if(this.timer.time > 20 && this.level === 2) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 3;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [20,40,50,60];
            }

            if(this.timer.time > 30 && this.level === 3) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 4;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [10,20,40,40];
            }
            if(this.timer.time > 60 && this.level === 4) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 5;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [10,10,20,30];
            }

            //Achievements
            if(this.timer.time >= 15 && localStorage.getItem("15seconds") === "false") {
                localStorage.setItem("15seconds", "true");
            }
            if(this.timer.time >= 30 && localStorage.getItem("30seconds") === "false") {
                localStorage.setItem("30seconds", "true");
            }
            if(this.timer.time >= 60 && localStorage.getItem("60seconds") === "false") {
                localStorage.setItem("60seconds", "true");
            }
           
            //

            //class updates
            this.bars.forEach((bar) => {
                bar.update(deltaTime);
            });
            this.character.update(deltaTime);
            this.bars = this.bars.filter(bar => bar.position.x + bar.width > 0);
            
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

        if(this.gamestate === GAMESTATE.GAMEOVER) {
            if(parseInt(localStorage.getItem("colorSwapCount")) !== this.colorSwapCount) {
                localStorage.setItem("colorSwapCount", this.colorSwapCount.toString());
            }
            if(this.timer.time > this.bestTime) {
                this.bestTime = this.timer.time;
                localStorage.setItem("bestTime", this.bestTime.toString());
            }
        }

    }

    updateInterval() {
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0;
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
            if(this.loopCount - this.levelUpTime < 120 && this.levelUpTime !== 0) {
                ctx.drawImage(document.getElementById("levelUp"), this.gameWidth / 2 - 112.5, 100, 225, 100);
            }
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
            this.bars.forEach((bar) => bar.draw(ctx));
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
            if(this.lives !== 3) {
                this.reset();
            }
            this.lives = 3;
            if (this.countdown.duration > 0 && !this.countdown.paused) {
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
    }
}
