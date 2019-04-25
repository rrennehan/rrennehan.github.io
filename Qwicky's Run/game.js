"use strict";

import InputHandler from "./input.js";
import Character from "./character.js";
import Background from "./background.js";
import Bar from "./bar.js";
import Timer from "./timer.js";

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
    SAVESCORE: 10,
};

let reachedEndOfSong = false;

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
        this.intervalSpeeds = [40,50,50,60]; //Used for timing of bars
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0; //Used for timing of bars
        this.barUpdateTime = 0; //Used for timing of bars
        this.colorChain0 = 0; //Ensure only 4 of the same color in a row can appear
        this.colorChain1 = 0;
        
        //Game factors
        this.lives = 3;
        this.level = 1;
        this.levelUpTime = 0;
        this.lastLife = false; //Used to start heart beat sound and ensure it only starts once

        //Music and sounds
        this.gameTheme = document.getElementById("gameTheme");
        this.heartBeat = document.getElementById("heartBeat");
        this.countdown = document.getElementById("countdown");
        this.laserSound = document.getElementById("laserSound");
        this.levelUpSound = document.getElementById("levelUpSound");
        this.gameTheme.volume = 0;
        this.heartBeat.volume = 0;
        this.countdown.volume = 0;

        //Menu controls
        this.menuOptions = 6;
        this.selectedItem = 1;
        this.menuArray = ["Play", "Instructions/Controls", "Leaderboard", "Achievements", "Stats", "Credits"];
        this.itemYPosition;
        this.topItemPosition = 200;
        this.button1 = document.getElementById("buttonLeft");
        this.button2 = document.getElementById("buttonRight");
        

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
        if(localStorage.getItem("90seconds") === null) {
            localStorage.setItem("90seconds", "false");
        }
        if(localStorage.getItem("endOfSong") === null) {
            localStorage.setItem("endOfSong", "false");
        }
        if(localStorage.getItem("colorSwapCount") === null) {
            localStorage.setItem("colorSwapCount", "0");
        }
        if(localStorage.getItem("gravityFlipCount") === null) {
            localStorage.setItem("gravityFlipCount", "0");
        }
        if(localStorage.getItem("bestTime") === null) {
            localStorage.setItem("bestTime", "0.000");
        }
        if(localStorage.getItem("gamesPlayed") === null) {
            localStorage.setItem("gamesPlayed", "0");
        }
        if(localStorage.getItem("totalTimeRan") === null) {
            localStorage.setItem("totalTimeRan", "0.000");
        }
        if(localStorage.getItem("averageTimeRan") === null) {
            localStorage.setItem("averageTimeRan", "0.000");
        }
        
        //local statistics
        this.colorSwapCount = parseInt(localStorage.getItem("colorSwapCount"));
        this.gravityFlipCount = parseInt(localStorage.getItem("gravityFlipCount"));
        this.gamesPlayed = parseInt(localStorage.getItem("gamesPlayed"));
        this.bestTime = parseFloat(localStorage.getItem("bestTime"));
        this.totalTimeRan = parseFloat(localStorage.getItem("totalTimeRan"));
        this.averageTimeRan = parseFloat(localStorage.getItem("averageTimeRan"));

        //badges and achievements
        this.fifteenSecondsBadge;
        this.thirtySecondsBadge;
        this.sixtySecondsBadge;
        this.ninetySecondsBadge;
        this.endOfSongBadge;
        this.colorBadge;
        this.achievementTime = 0; //Use for timing with achievement unlocked banner
        this.achievementUnlocked; //Use to store which achievement was collected

        localStorage.getItem("15seconds") === "true" ? this.fifteenSecondsBadge = document.getElementById("15SecondsBadge") : this.fifteenSecondsBadge = document.getElementById("15SecondsBadgeLocked");
        localStorage.getItem("30seconds") === "true" ? this.thirtySecondsBadge = document.getElementById("30SecondsBadge") : this.thirtySecondsBadge = document.getElementById("30SecondsBadgeLocked");
        localStorage.getItem("60seconds") === "true" ? this.sixtySecondsBadge = document.getElementById("60SecondsBadge") : this.sixtySecondsBadge = document.getElementById("60SecondsBadgeLocked");
        localStorage.getItem("90seconds") === "true" ? this.ninetySecondsBadge = document.getElementById("90SecondsBadge") : this.ninetySecondsBadge = document.getElementById("90SecondsBadgeLocked");
        localStorage.getItem("endOfSong") === "true" ? this.endOfSongBadge = document.getElementById("endOfSongBadge") : this.endOfSongBadge = document.getElementById("endOfSongBadgeLocked");
        parseInt(localStorage.getItem("colorSwapCount")) >= 100000 ? this.colorBadge = document.getElementById("colorBadge") : this.colorBadge = document.getElementById("colorBadgeLocked");

        //leaderboard

        this.leaderboardLoaded = false;
        this.leaderboard;
        this.scores = [];
        
        this.loadAttempts = 0;
        this.tooSlow = false; //If the game runs too slowly, prevent the player from saving their score
        this.tooSlowChain = 0;
        this.userName;
    }

    start() {
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
                reachedEndOfSong = true;
            }
            this.currentTime = 0;
            this.play();
        }, false);
        this.heartBeat.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        this.tooSlow = false;
        this.userName = undefined;
    }

    gameOver() {
        this.button1.src = "assets/images/enterButton.png";
        this.button2.src = "assets/images/selectButton.png";
        this.timer.stop();
        this.gamesPlayed ++;
        this.averageTimeRan = (parseFloat(this.timer.time.toFixed(3)) + this.totalTimeRan) / this.gamesPlayed;
        if(this.timer.time > this.bestTime) {
            this.bestTime = this.timer.time;
        }
        this.totalTimeRan += parseFloat(this.timer.time.toFixed(3));
    }

    reset() {
        this.bars = [];
        this.intervalSpeeds = [40,50,50,60];
        this.level = 1;
        this.levelUpTime = 0;
        this.character.reset();
        this.background.reset();
        this.loopCount = 0;
        this.achievementTime = 0;
    }

    updateInterval() {
        this.intervalSelector = Math.floor(Math.random() * (this.intervalSpeeds.length - 0)) + 0;
    }

    /*loadLeaderboard() {
        if(this.loadAttempts >= 10) return;
        fetch('/scores')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(json => {
            this.leaderboard = json;
            this.leaderboardLoaded = true;
            this.scores = this.leaderboard.Scores;
        })
        .catch(()=> {
            console.log("Error");
            this.loadAttempts ++;
            
        })
    }*/

    update(deltaTime) {
        if(this.gamestate === GAMESTATE.RUNNING) {
            
            if(!this.tooSlow) { //Perform a check on the game's update speed (FPS)
                if(deltaTime > 18) { //Game is running at less than 55fps
                    this.tooSlowChain ++;
                }
                else {
                    this.tooSlowChain = 0;
                }
    
                if(this.tooSlowChain > 60) { //less than 55fps for 120 cycles in a row
                    this.tooSlow = true; //Player is running the game too slowly and has an unfair advantage. Prevent saving to leaderboard
                    console.log("Too slow!");
                }
            }
            //Game updates
            if(this.lives < 1) { //Cause a game over
                this.gameTheme.pause();
                this.gameTheme.currentTime = 0;
                this.heartBeat.pause();
                this.heartBeat.currentTime = 0;
                this.gamestate = GAMESTATE.GAMEOVER;
                this.menuArray = ["Save Score", "Main Menu"];
                this.menuOptions = 2;
                this.topItemPosition = 300;
                return;
            }

            else if(this.lives === 1 && !this.lastLife) {
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
                this.intervalSpeeds = [30,40,40,50];
            }

            else if(this.timer.time > 20 && this.level === 2) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 3;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [20,30,30,40];
            }

            else if(this.timer.time > 30 && this.level === 3) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 4;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [10,20,30,30];
            }
            else if(this.timer.time > 60 && this.level === 4) {
                this.levelUpSound.currentTime = 0;
                this.levelUpSound.play();
                this.level = 5;
                this.levelUpTime = this.loopCount;
                this.intervalSpeeds = [10,10,20,30];
            }

            //Achievements
            if(this.timer.time >= 15 && localStorage.getItem("15seconds") === "false") {
                localStorage.setItem("15seconds", "true");
                this.achievementTime = this.loopCount;
                console.log(this.achievementTime);
                console.log(this.loopCount);
                this.achievementUnlocked = 0;
                this.fifteenSecondsBadge = document.getElementById("15SecondsBadge");
            }
            if(this.timer.time >= 30 && localStorage.getItem("30seconds") === "false") {
                localStorage.setItem("30seconds", "true");
                this.achievementTime = this.loopCount;
                this.achievementUnlocked = 1;
                this.thirtySecondsBadge = document.getElementById("30SecondsBadge");
            }
            if(this.timer.time >= 60 && localStorage.getItem("60seconds") === "false") {
                localStorage.setItem("60seconds", "true");
                this.achievementTime = this.loopCount;
                this.achievementUnlocked = 2;
                this.sixtySecondsBadge = document.getElementById("60SecondsBadge");
            }
            if(this.timer.time >= 90 && localStorage.getItem("90seconds") === "false") {
                localStorage.setItem("90seconds", "true");
                this.achievementTime = this.loopCount;
                this.achievementUnlocked = 3;
                this.ninetySecondsBadge = document.getElementById("90SecondsBadge");
            }
            if(reachedEndOfSong) {
                reachedEndOfSong = false;
                this.achievementTime = this.loopCount;
                this.achievementUnlocked = 4;
                this.endOfSongBadge = document.getElementById("endOfSongBadge");
            }    
           
            //

            //class updates
            this.bars.forEach((bar) => {
                bar.update(deltaTime);
            });
            this.bars = this.bars.filter(bar => bar.position.x + bar.width > 0);
            this.character.update(deltaTime);
            
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
            localStorage.setItem("gamesPlayed", this.gamesPlayed.toString());
            if(parseInt(localStorage.getItem("colorSwapCount")) !== this.colorSwapCount) {
                localStorage.setItem("colorSwapCount", this.colorSwapCount.toString());
            }
            if(parseInt(localStorage.getItem("gravityFlipCount")) !== this.gravityFlipCount) {
                localStorage.setItem("gravityFlipCount", this.gravityFlipCount.toString());
            }
            localStorage.setItem("bestTime", this.bestTime.toString());
            localStorage.setItem("totalTimeRan", this.totalTimeRan.toString());
            localStorage.setItem("averageTimeRan", this.averageTimeRan.toString());
            
        }

        /*if(this.gamestate === GAMESTATE.LEADERBOARDS) {
            if(!this.leaderboardLoaded) {
                this.loadLeaderboard();
            }
        }*/

        if(this.gamestate === GAMESTATE.ACHIEVEMENTS) {
            localStorage.getItem("15seconds") === "true" ? this.fifteenSecondsBadge = document.getElementById("15SecondsBadge") : this.fifteenSecondsBadge = document.getElementById("15SecondsBadgeLocked");
            localStorage.getItem("30seconds") === "true" ? this.thirtySecondsBadge = document.getElementById("30SecondsBadge") : this.thirtySecondsBadge = document.getElementById("30SecondsBadgeLocked");
            localStorage.getItem("60seconds") === "true" ? this.sixtySecondsBadge = document.getElementById("60SecondsBadge") : this.sixtySecondsBadge = document.getElementById("60SecondsBadgeLocked");
            localStorage.getItem("90seconds") === "true" ? this.ninetySecondsBadge = document.getElementById("90SecondsBadge") : this.ninetySecondsBadge = document.getElementById("90SecondsBadgeLocked");
            localStorage.getItem("endOfSong") === "true" ? this.endOfSongBadge = document.getElementById("endOfSongBadge") : this.endOfSongBadge = document.getElementById("endOfSongBadgeLocked");
            parseInt(localStorage.getItem("colorSwapCount")) >= 100000 ? this.colorBadge = document.getElementById("colorBadge") : this.colorBadge = document.getElementById("colorBadgeLocked");
        }
        if(this.gamestate === GAMESTATE.SAVESCORE) {
            
        }
    }

    preRender(ctx) {
        this.background.draw(ctx);
        this.character.draw(ctx);
        this.bars.forEach((bar) => bar.draw(ctx));

        if(this.gamestate === GAMESTATE.COUNTDOWN) {
            this.button1.src = "assets/images/swapColorButton.png";
            this.button2.src = "assets/images/flipGravityButton.png";
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
        if(this.gamestate === GAMESTATE.RUNNING) {
            /*ctx.rect(0, 0, 800, 600);
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fill();*/ //Throttle to test lower FPS
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
            if(this.loopCount - this.levelUpTime < 120 && this.levelUpTime !== 0) {
                ctx.drawImage(document.getElementById("levelUp"), this.gameWidth / 2 - 113, 100, 225, 100);
            }
        }

        if(this.gamestate === GAMESTATE.GAMEOVER) {
            this.setUpMenu(ctx);
            ctx.font = "30px Arial, sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText('Game over', this.gameWidth /2, 200);
            ctx.fillText(`You survived for ${this.timer.time.toFixed(3)} seconds`, this.gameWidth /2, 240);
            ctx.drawImage(document.getElementById("rightArrow"), this.gameWidth / 2 - 275, 250 + (50 * this.selectedItem), 100, 40);
            ctx.drawImage(document.getElementById("leftArrow"), this.gameWidth / 2 + 175, 250 + (50 * this.selectedItem), 100, 40);
        }

        else if(this.gamestate === GAMESTATE.MENU) {
            this.setUpMenu(ctx);
            ctx.drawImage(document.getElementById("gameLogo"),  150, 25, 500, 150);
            ctx.drawImage(document.getElementById("rightArrow"), this.gameWidth / 2 - 275, 150 + (50 * this.selectedItem), 100, 40);
            ctx.drawImage(document.getElementById("leftArrow"), this.gameWidth / 2 + 175, 150 + (50 * this.selectedItem), 100, 40);
        }
        else if(this.gamestate === GAMESTATE.INSTRUCTIONS) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(150,75,500,400);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Space Bar: Swap Color", 160, 120 );
            ctx.fillText("Up and Down arrows: Flip Gravity", 160, 160);
            ctx.fillText("Swap colors to match the color of the lasers.", 160, 240, 400);
            ctx.fillText("If your color doesn't match, you lose a life!", 160, 280, 400);
            ctx.fillText("Spikes must be avoided. Hit the up or down", 160, 360, 400);
            ctx.fillText("key to flip gravity and avoid spikes!", 160, 400, 400);
            ctx.fillText("Survive as long as you can!", 160, 460, 400); 
        }
        else if(this.gamestate === GAMESTATE.LEADERBOARDS) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(150,75,500,400);
            ctx.font = "25px Lucida Console, monospace, sans-serif";
            ctx.fillStyle = "black";
            ctx.fillText("Coming Soon!", this.gameWidth / 2, this.gameHeight / 2);
            /*ctx.textAlign = "left";
            
            if(this.leaderboardLoaded) {
                let topPosition = 200;
                let loop = 0;
                this.scores.forEach(score => {
                    loop ++;
                    ctx.textAlign = "left";
                    ctx.fillText(`#${loop} ${score.Name}`, 180, topPosition);
                    ctx.textAlign = "right"
                    ctx.fillText(`${score.Time} seconds`, 625, topPosition, 200);
                    topPosition += 40;
                });
            }
            else if(this.loadAttempts >= 10) {
                ctx.textAlign = "center";
                ctx.fillText('Unable to load leaderboard', this.gameWidth /2, this.gameHeight / 2);
            }
            */
        }
        else if(this.gamestate === GAMESTATE.ACHIEVEMENTS) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(this.gameWidth / 2 - 250,75,500,400);
            ctx.drawImage(this.fifteenSecondsBadge, 160, 100, 125, 125);
            ctx.drawImage(this.thirtySecondsBadge, this.gameWidth/2 - 62, 100, 125, 125);
            ctx.drawImage(this.sixtySecondsBadge, 510, 100, 125, 125);
            ctx.drawImage(this.ninetySecondsBadge, 160, 325, 125, 125);
            ctx.drawImage(this.endOfSongBadge, this.gameWidth/2 - 62, 325, 125, 125);
            ctx.drawImage(this.colorBadge, 510, 325, 125, 125);
        }
        else if(this.gamestate === GAMESTATE.STATS) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(150,75,500,400);
            ctx.font = "20px Arial, sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.fillText(`Games Played: ${this.gamesPlayed}`, 175, 120);
            ctx.fillText(`Best Time: ${this.bestTime} seconds`, 175, 150);
            ctx.fillText(`Average Time Survived: ${this.averageTimeRan.toFixed(3)} seconds`, 175, 180);
            ctx.fillText(`Total Time Ran: ${this.totalTimeRan.toFixed(3)} seconds`, 175, 210);
            ctx.fillText(`Color Swap Count: ${this.colorSwapCount}`, 175, 240);
            ctx.fillText(`Gravity Flip Count: ${this.gravityFlipCount}`, 175, 270);
        }
        else if(this.gamestate === GAMESTATE.CREDITS) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(150,75,500,400);
            ctx.fillStyle = "black";
            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Game Creator: Richard Rennehan", 160, 120, 400); 
            ctx.fillText("Game Theme: Ukigumo (By Hige Driver)", 160, 160, 400);
            ctx.fillText("I highly recommend you check the rest of", 160, 400);
            ctx.fillText("Hige Driver's music. Please consider supporting his work!", 160, 440);
        }
        else if(this.gamestate === GAMESTATE.SAVESCORE) {
            this.setUpMenu(ctx);
            ctx.fillStyle = "white";
            ctx.fillRect(150,75,500,400);
            ctx.fillStyle = "black";
            ctx.font = "20px Arial, sans-serif";
            ctx.fillText("Work in progress", this.gameWidth/2, this.gameHeight/2);
            /*
            ctx.textAlign = "left";
            if(this.tooSlow) {
                ctx.fillText("Your game ran too slowly. This gives you an unfair", 160, 120);
                ctx.fillText("advantage. To ensure the leaderboards are accurate", 160, 140);
                ctx.fillText("you are unable to save your score.", 160, 160);
                ctx.fillText("To speed up the game, try closing other applications.", 160, 200);
                ctx.fillText("If that doesn't work, you may need a faster computer.", 160, 220);
            }
            else {
                if(this.userName === undefined) {
                    this.userName = prompt("Enter your name");
                }
                else if(this.userName === "" || this.userName === null) {
                    ctx.fillText(`Your score has not been saved.`, 160, 120);
                }
                else if(this.userName !== undefined && this.userName !== "" && this.userName.length < 12) {
                    ctx.fillText(`Congrats, ${this.userName}! Your score of ${this.timer.time} has been saved.`, 160, 120);
                }
                else if(this.userName.length >= 12) {
                    this.userName = prompt("Name must be under 12 characters");
                }
            }*/
        }
        if(this.loopCount - this.achievementTime < 240 && this.achievementTime !== 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(500,5,275,65);
            switch(this.achievementUnlocked) {
                case 0:
                    ctx.drawImage(this.fifteenSecondsBadge, 505, 7, 60, 60);
                    break;
                case 1:
                    ctx.drawImage(this.thirtySecondsBadge, 505, 7, 60, 60);
                    break;
                case 2:
                    ctx.drawImage(this.sixtySecondsBadge, 505, 7, 60, 60);
                    break;
                case 3:
                    ctx.drawImage(this.ninetySecondsBadge, 505, 7, 60, 60);
                    break;
                case 4:
                    ctx.drawImage(this.endOfSongBadge, 505, 7, 60, 60);
                    break;
            }
            ctx.fillStyle = "black"
            ctx.font = "18px Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("Achievement Unlocked!", 575, 40); 
        }
    }

    setUpMenu(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,this.gameWidth, this.gameHeight);

        this.itemYPosition = this.topItemPosition;
        for(let i = 1; i <= this.menuOptions; i++) {
            ctx.fillStyle = "white";
            if(i === this.selectedItem) {
                ctx.fillStyle = "#D3D3D3";
            }
            ctx.fillRect(this.gameWidth/2 - 150, this.itemYPosition, 300, 40)
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.menuArray[i-1], this.gameWidth /2, this.itemYPosition + 30);
            this.itemYPosition += 50; 
        }

        this.itemYPosition = this.topItemPosition;
    }
}
