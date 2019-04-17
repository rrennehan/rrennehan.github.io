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

    } else {
        return false;
    }
}