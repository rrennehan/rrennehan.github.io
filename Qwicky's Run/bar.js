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
        this.colorState = Math.round(Math.random());
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.position.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.colors[this.colorState];
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}