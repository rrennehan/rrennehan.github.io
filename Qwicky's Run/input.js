import Character from "./character.js";
import Game from "./game.js";

const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4
};

export default class InputHandler {

    constructor(character, game) {
        
        document.addEventListener('keydown', (event) => {

            switch(event.keyCode) {
                case 38:
                if(game.gamestate === GAMESTATE.RUNNING && 
                    character.speed >= 0 &&
                    character.position.y > 475 - character.size.height) {
                        character.readyToFlip();
                    }
                    break;
                case 40:
                    if(game.gamestate === GAMESTATE.RUNNING && 
                        character.speed <= 0 &&
                        character.position.y < 125) {
                        character.readyToFlip();
                    } 
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {

            switch(event.keyCode) {
                case 38:
                    if(game.gamestate === GAMESTATE.RUNNING && 
                        character.speed >= 0 &&
                        character.position.y > 475 - character.size.height) character.readyToFlip();
                    break;
                case 40:
                    if(game.gamestate === GAMESTATE.RUNNING && 
                        character.speed <= 0 &&
                        character.position.y < 125) character.readyToFlip();
                    break;
                case 32:
                    if(game.gamestate === GAMESTATE.RUNNING) character.swapColor();
                    break;
                case 13: //Enter key
                    if(game.gamestate === GAMESTATE.MENU) game.start();
                    if(game.gamestate === GAMESTATE.GAMEOVER) game.start();
                    break;
                case 27:
                    //game.togglePause();
                    break;
                case 32:
                    //game.start();
                    break;
            }
        });

    }


}