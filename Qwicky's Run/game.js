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
    NEWLEVEL: 4,
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gamestate = GAMESTATE.MENU;

        this.character = new Character(this);
        this.background = new Background(this);
        this.timer;
        this.bars = [];
        this.lives = 3;
        this.gameObjects = [];
        new InputHandler(this.character, this);
        
        this.loopCount = 0; //Currently unused
        this.drawCount = 0; //Used for heart pulse effect

        this.intervalSpeeds = [10,20,30,40]; //Used for timing of bars
        this.intervalSelector = Math.floor(Math.random() * (4 - 0)) + 0; //Used for timing of bars
        this.barUpdateTime = 0; //Used for timing of bars
        
        this.lastLife = false; //Used to start heat beat sound and ensure it only starts once

        this.gameTheme = new Audio("assets/sounds/gameTheme.mp3")
        this.heartBeat = new Audio("assets/sounds/heartBeat.mp3");
        this.laserSound = new Audio("assets/sounds/laserSound.mp3");
        
        //this.levels = [level1, level2];
        //this.currentLevel = 0;
    }

    start() {
        if(this.gamestate !== GAMESTATE.MENU && this.gamestate !== GAMESTATE.GAMEOVER) return;
        this.gamestate = GAMESTATE.RUNNING;
        this.timer = new Timer(this);
        this.lives = 3;
        this.lastLife = false;
        this.gameTheme.currentTime = 0;
        this.heartBeat.currentTime = 0;
        this.gameTheme.play();
        this.heartBeat.volume = 0;
        this.heartBeat.play();
        this.gameTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        this.heartBeat.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }

    update(deltaTime) {
        if(this.gamestate === GAMESTATE.RUNNING) {
            //Game updates
            this.loopCount ++;
            this.barUpdateTime ++;
            
            if(this.lives === 1 && !this.lastLife) {
                this.lastLife = true;
                this.heartBeat.volume = 1; 
            }
            
            if(this.lives < 1) {
                this.bars = [];
                this.gameTheme.pause();
                this.gameTheme.currentTime = 0;
                this.heartBeat.pause();
                this.heartBeat.currentTime = 0;
                this.gamestate = GAMESTATE.GAMEOVER;
                this.character.reset();
                return;
            }

            //class updates
            this.character.update(deltaTime);
            this.bars = this.bars.filter(bar => !bar.markedForDeletion);
            this.bars = this.bars.filter(bar => bar.position.x > 0);
            if(this.character.state !== 1) {
                this.bars = [];
                this.intervalSelector = 3;
            } 
            if(this.barUpdateTime % this.intervalSpeeds[this.intervalSelector] * this.character.state === 0) {
                this.character.state = 1;
                this.bars.push(new Bar(this));
                this.updateInterval();
                this.barUpdateTime = 0;
            }
            this.bars.forEach((bar) => {
                bar.update(deltaTime);
            });

            this.timer.update(deltaTime);


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
                        ctx.drawImage(document.getElementById("img_heart"), 0, 0, 50+this.drawCount, 50+this.drawCount);
                        this.drawCount = 0;
                    }
                    else{
                        ctx.drawImage(document.getElementById("img_heart"), i * 50 + 10, 10, 50, 50);
                    }
                }
                else{
                    ctx.drawImage(document.getElementById("img_heart"), i * 50 + 10, 10, 50, 50);
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
            ctx.fillText(`Your score was ${this.timer.time}`, this.gameWidth /2, this.gameHeight / 2 + 40);
            ctx.fillText('Press ENTER to retry', this.gameWidth /2, this.gameHeight / 2 + 80);
        }

    }

    updateInterval() {
        this.intervalSelector = Math.floor(Math.random() * (4 - 0)) + 0;
    }
}
