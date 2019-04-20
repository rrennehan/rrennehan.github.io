"use strict";


export function detectCollision(character, gameObject) {
    
    let bottomOfCharacter = character.position.y + character.size.height;
    let topOfCharacter = character.position.y;
    let leftSideOfCharacter = character.position.x;
    let rightSideOfCharacter = character.position.x + character.size.width;

    let topOfObject = gameObject.position.y;
    let leftSideOfObject = gameObject.position.x;
    let rightSideOfObject = gameObject.position.x + gameObject.width;
    let bottomOfObject = gameObject.position.y + gameObject.height;

    if(topOfObject <= topOfCharacter &&
        leftSideOfObject <= leftSideOfCharacter &&
        rightSideOfObject >= leftSideOfCharacter &&
        bottomOfObject >= bottomOfCharacter 
        ){
        return true;

    } else if(gameObject.colorState === 2) { //Special rules for spikes
        if(gameObject.colorGenerator <= 94 &&
            topOfCharacter < bottomOfObject && 
            leftSideOfObject <= leftSideOfCharacter &&
            rightSideOfObject >= leftSideOfCharacter) {
                return true;
            }
        if(gameObject.colorGenerator > 94 && 
            bottomOfCharacter > topOfObject && 
            leftSideOfObject <= leftSideOfCharacter &&
            rightSideOfObject >= leftSideOfCharacter) {
                return true;
            }
    }
    else {
        return false;
    }
}