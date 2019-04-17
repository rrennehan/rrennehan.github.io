export default class Background {

    constructor (game) {
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        ctx.fillStyle = "#696969";
        ctx.fillRect(0,0,800,75);
        ctx.fillRect(0,this.gameHeight - 75,800,75);
        ctx.fillStyle = "#D3D3D3";
        ctx.fillRect(0,75,800,450);
    }
}