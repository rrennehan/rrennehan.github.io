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
        this.state = 1;
        this.flipStatus = 0;

        this.size = {width: 50, height: 75};
        this.position = {x: 80, y: 525-this.size.height};

        this.image1 = document.getElementById("orangeSmileRight");
        this.image2 = document.getElementById("blueSmileRight");
        this.image3 = document.getElementById("orangeSmileLeft");
        this.image4 = document.getElementById("blueSmileLeft");

        this.loopCount = 0;
        this.whichLeg = true;
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
    }

    reset() {
        this.speed = 15;
        this.maxSpeed = 15;
        
        this.colors = ["#e56b29", "#3351f7"];
        this.colorState = 0;
        this.state = 1;
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
                    this.state = 5;
                    this.game.laserSound.currentTime = 0;
                    this.game.laserSound.play();
                }
            }
        
        });
    }

    draw(ctx) {
        if(this.flipStatus === 1) {
            this.flipStatus = 0;
        } 
        //ctx.rotate(90*Math.PI/180);
        this.loopCount ++;
        if(this.game.gamestate === GAMESTATE.RUNNING) {
            if(this.loopCount % 10 === 0) {
                this.whichLeg = !this.whichLeg;
                this.loopCount = 0;
            }
        }
        if(this.speed > 0) {
            if(this.colorState === 0) {
                if(this.whichLeg) {
                    ctx.drawImage(this.image3, this.position.x, this.position.y, this.size.width, this.size.height);
                }
                else {
                    ctx.drawImage(this.image1, this.position.x, this.position.y, this.size.width, this.size.height);
                }
            }
            else if(this.colorState === 1) {
                if(this.whichLeg) {
                    ctx.drawImage(this.image4, this.position.x, this.position.y, this.size.width, this.size.height);
                }
                else {
                    ctx.drawImage(this.image2, this.position.x, this.position.y, this.size.width, this.size.height);
                }
            }
        }
        else if(this.speed < 0) {
            if(this.colorState === 0) {
                if(this.whichLeg) {
                    this.rotateAndPaintImage(ctx, this.image3, 180*Math.PI/180, this.position.x, this.position.y, this.size.width, this.size.height);
                }
                else {
                    this.rotateAndPaintImage(ctx, this.image1, 180*Math.PI/180, this.position.x, this.position.y, this.size.width, this.size.height);
                }
            }
            else if(this.colorState === 1) {
                if(this.whichLeg) {
                    this.rotateAndPaintImage(ctx, this.image4, 180*Math.PI/180, this.position.x, this.position.y, this.size.width, this.size.height);
                }
                else {
                    this.rotateAndPaintImage(ctx, this.image2, 180*Math.PI/180, this.position.x, this.position.y, this.size.width, this.size.height);
                }
            }
        }

        
    }

}