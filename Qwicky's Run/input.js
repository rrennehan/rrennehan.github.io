"use strict";

import Character from "./character.js";
import Game from "./game.js";

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
                    if(game.gamestate !== GAMESTATE.RUNNING && game.gamestate !== GAMESTATE.COUNTDOWN) {
                        game.selectedItem --;
                        if(game.selectedItem === 0) game.selectedItem = game.menuOptions;
                    }
                    break;
                case 40:
                    if(game.gamestate === GAMESTATE.RUNNING && 
                        character.speed <= 0 &&
                        character.position.y < 125) {
                        character.readyToFlip();
                    }
                    if(game.gamestate !== GAMESTATE.RUNNING && game.gamestate !== GAMESTATE.COUNTDOWN) {
                        game.selectedItem ++;
                        if(game.selectedItem > game.menuOptions) game.selectedItem = 1;
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
                    if(game.gamestate === GAMESTATE.MENU) {
                        if(game.selectedItem === 1) {
                            game.gamestate = GAMESTATE.COUNTDOWN;
                            game.countdown.volume = 1;
                            game.countdown.currentTime = 0;
                            game.countdown.play();
                        }
                        else if(game.selectedItem === 2) { //Controls/Instructions
                            game.gamestate = GAMESTATE.INSTRUCTIONS;
                            game.menuOptions = 1;
                            game.selectedItem = 1;
                            game.menuArray = ["Hit ENTER to return"];
                            game.topItemPosition = 475; 
                        }
                        else if(game.selectedItem === 3) { //Leaderboards
                            game.gamestate = GAMESTATE.LEADERBOARDS;
                            game.menuOptions = 1;
                            game.selectedItem = 1;
                            game.menuArray = ["Hit ENTER to return"];
                            game.topItemPosition = 475; 
                        }
                        else if(game.selectedItem === 4) { //Achievements
                            game.gamestate = GAMESTATE.ACHIEVEMENTS;
                            game.menuOptions = 1;
                            game.selectedItem = 1;
                            game.menuArray = ["Hit ENTER to return"];
                            game.topItemPosition = 475; 
                        }
                        else if(game.selectedItem === 5) { //Stats
                            game.gamestate = GAMESTATE.STATS;
                            game.menuOptions = 1;
                            game.selectedItem = 1;
                            game.menuArray = ["Hit ENTER to return"];
                            game.topItemPosition = 475; 
                        }
                        else if(game.selectedItem === 6) { //Credits
                            game.gamestate = GAMESTATE.CREDITS;
                            game.menuOptions = 1;
                            game.selectedItem = 1;
                            game.menuArray = ["Hit ENTER to return"];
                            game.topItemPosition = 475; 
                        }
                        
                    }
                    else if(game.gamestate === GAMESTATE.INSTRUCTIONS) {
                        game.gamestate = GAMESTATE.MENU;
                        game.menuOptions = 6;
                        game.selectedItem = 2;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                    }
                    else if(game.gamestate === GAMESTATE.LEADERBOARDS) {
                        game.gamestate = GAMESTATE.MENU;
                        game.menuOptions = 6;
                        game.selectedItem = 3;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                    }
                    else if(game.gamestate === GAMESTATE.ACHIEVEMENTS) {
                        game.gamestate = GAMESTATE.MENU;
                        game.menuOptions = 6;
                        game.selectedItem = 4;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                    }
                    else if(game.gamestate === GAMESTATE.STATS) {
                        game.gamestate = GAMESTATE.MENU;
                        game.menuOptions = 6;
                        game.selectedItem = 5;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                    }
                    else if(game.gamestate === GAMESTATE.CREDITS) {
                        game.gamestate = GAMESTATE.MENU;
                        game.menuOptions = 6;
                        game.selectedItem = 6;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                    }

                    else if(game.gamestate === GAMESTATE.GAMEOVER) {
                        game.gamestate = GAMESTATE.MENU;
                        game.reset();
                        game.lives = 3;
                        game.menuOptions = 6;
                        game.selectedItem = 1;
                        game.menuArray = ["Play", "Instructions/Controls", "Leaderboards", "Achievements", "Stats", "Credits"];
                        game.topItemPosition = 200; 
                        game.countdown.volume = 0;
                        game.countdown.play();
                    } 
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