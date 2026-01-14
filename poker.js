"use strict";

//Grabbing document elements
let first_player_background = document.getElementById("player_one");
let second_player_background = document.getElementById("player_two");
let redrawButton = document.getElementById("reset");
let loopButton = document.getElementById("loop");
let statsButton = document.getElementById("statsButton");
let statsBar = document.getElementById("stats");
let totalDrawText = document.getElementById("drawCount");
//

//General variable declaration
let first_player_hand   = [];
let second_player_hand  = [];
let currentHand = [];
let currentValue; //
let first_player_score;
let second_player_score;
let first_player_rank;
let second_player_rank;
//

//Lists to store card numbers
let matchingCardNumbers = [];
let uniqueCardNumbers = [];
let allCardNumbers = [];
//

//Statistics variables
let totalDraws = 0;
let royalFlushCount = 0;
let straightFlushCount = 0;
let fourKindCount = 0;
let fullHouseCount = 0;
let flushCount = 0;
let straightCount = 0;
let threeKindCount = 0;
let twoPairCount = 0;
let pairCount = 0;
let highCount = 0;
//

let loopInterval;

//Determine rankings of hands
let cardRankings = 
[
    "Pair", "Two Pair",
    "Three of a Kind", "Straight", "Flush",
    "Full House", "Four of a Kind", "Straight Flush",
    "Royal Flush"
]; //Used to determine winner by the greater index value

let numberRankings =
[
    "", "", "2", "3", "4", "5", "6",
    "7","8","9","10","JACK",
    "QUEEN","KING", "ACE"
];
//

//General Functions
function matchNumber(element)
{
    return element === currentValue;
}

function orderCardArray(cardArray)
{
    cardArray.sort((a, b) => a - b); //Sort by number
    
    return cardArray;
}

function findUniqueAndMatchingValues(cards)
{
    let unique = [];
    let matching = [];

    for(let i = 0; i < cards.length; i++)
    {
        if(!unique.includes(cards[i]))
        {
            unique[i] = cards[i];
        }
        else
        {
            currentValue = cards[i];
            let cardtoSwap = unique.findIndex(matchNumber);
            if(!matching.includes(unique[cardtoSwap]))
            {
               matching.push(unique[cardtoSwap]); 
            }
            matching.push(cards[i]);
        }
    }

    orderCardArray(unique);
    orderCardArray(matching);
    
    return [unique, matching];
}

function findHighestCard(cardArray, rank, matchingCards)
{
    let topCard = 2;
    let curVal;
    for(let i = 0; i < cardArray.length; i++) 
    {
        curVal = cardArray[i];
        if(rank === "noMatch" || rank === "Straight")
        {
            if(curVal > topCard)
            {
                topCard = curVal;
            }
        }
        else if(rank === "Match")
        {
            if(curVal > topCard && !matchingCards.includes(curVal))
            {
                topCard = curVal; //Only replace 
            }
        }

    }
    return topCard;
}
//

//Main function to score hand
function scoreHand(pokerHand)
{
    //Returns a list of the card rank and the highest card. 
    //Highest card used in case of the same rank to determine winner
    currentHand = pokerHand;
    let highestCard = 2;
    let valueMatch = 2; //The top card of the rank (e.g. 8 if straight is 4,5,6,7,8)
    let timesInARow;
    let conditionTrue;
    let result;
    allCardNumbers = [];
    for(let i = 0; i < pokerHand.length; i++)
    {
        currentValue = pokerHand[i].value;
        currentValue = numberRankings.indexOf(currentValue)
        allCardNumbers.push(currentValue);
    }

    result = findUniqueAndMatchingValues(allCardNumbers);

    uniqueCardNumbers = result[0];
    matchingCardNumbers = result[1]; 

    //Royal Flush and Straight Flush check
    
    conditionTrue = true;
    for(let i = 0; i < pokerHand.length; i++)
    {
        if(pokerHand[i].suit !== pokerHand[0].suit)
        {
            conditionTrue = false;
            break;
        }
    }
    if(conditionTrue) //Is a flush. Now check for straight
    {
        if(uniqueCardNumbers.length === 5)
        {
            if(uniqueCardNumbers[uniqueCardNumbers.length - 1] === 14 && 
                uniqueCardNumbers[uniqueCardNumbers.length - 2] === 5) //Ace can be high or low
            {
                uniqueCardNumbers[uniqueCardNumbers.length - 1] = 1; //Change Ace to low
                orderCardArray(uniqueCardNumbers); 
            }
            if(uniqueCardNumbers[uniqueCardNumbers.length-1] - uniqueCardNumbers[0] === 4)
            {
                valueMatch = uniqueCardNumbers[uniqueCardNumbers.length - 1];
                highestCard = findHighestCard(allCardNumbers, "Straight");
                if(valueMatch === 14) //Ace is the top value
                {
                    royalFlushCount += 1;
                    return ["Royal Flush", highestCard, valueMatch];
                }
                else
                {
                    straightFlushCount += 1;
                    return ["Straight Flush", highestCard, valueMatch];
                }
            }
        }      
    }

    //4 of a kind        

    if(matchingCardNumbers.length >= 4)
    {
        timesInARow = 0;
        for(let i = 0; i < matchingCardNumbers.length; i++)
        {
            if(matchingCardNumbers[i] !== matchingCardNumbers[0])
            {
                break; //No chance of four in a kind. Break out of loop early to save resources
            }
            else
            {
                timesInARow += 1;    
            }

            if(timesInARow === 4)
            {
                valueMatch = matchingCardNumbers[i];
                highestCard = findHighestCard(allCardNumbers, "Match", matchingCardNumbers);
                fourKindCount += 1;
                return["Four of a Kind", highestCard, valueMatch];
            }
        }
    }

    //Full house

    if(matchingCardNumbers.length === 5)
    {
        valueMatch = matchingCardNumbers[matchingCardNumbers.length - 1];
        highestCard = findHighestCard(allCardNumbers, "Match", matchingCardNumbers);
        fullHouseCount += 1;
        return["Full House", highestCard, valueMatch];
    }

    //Flush

    conditionTrue = true;
    for(let i = 0; i < pokerHand.length; i++)
    {
        if(pokerHand[i].suit !== pokerHand[0].suit)
        {
            conditionTrue = false;
            break;
        }
    }

    if(conditionTrue)
    {
        valueMatch = allCardNumbers[allCardNumbers.length - 1];
        highestCard = findHighestCard(allCardNumbers, "noMatch");
        flushCount += 1;
        return["Flush", highestCard, valueMatch];
    }

    //Straight

    if(uniqueCardNumbers.length === 5)
    {
        if(uniqueCardNumbers[uniqueCardNumbers.length - 1] === 14 && 
            uniqueCardNumbers[0] !== 10) //Ace can be high or low
        {
            uniqueCardNumbers[uniqueCardNumbers.length - 1] = 1; //Change Ace to low
            orderCardArray(uniqueCardNumbers); 
        }
        if(uniqueCardNumbers[uniqueCardNumbers.length-1] - uniqueCardNumbers[0] === 4)
        {
            valueMatch = uniqueCardNumbers[uniqueCardNumbers.length - 1];
            highestCard = findHighestCard(allCardNumbers, "Straight");
            straightCount += 1;
            return["Straight", highestCard, valueMatch];
        }
    }

    //Three of a kind

    if(matchingCardNumbers.length >= 3)
    {
        currentValue = matchingCardNumbers[0];
        timesInARow = 0;
        for(let i = 0; i < matchingCardNumbers.length; i++)
        {
            if(matchingCardNumbers[i] === currentValue)
            {
                timesInARow += 1;
            }
            else
            {
                currentValue = matchingCardNumbers[i];
                timesInARow = 0;
            }

            if(timesInARow === 3)
            {
                valueMatch = matchingCardNumbers[i];
                highestCard = findHighestCard(allCardNumbers, "Match", matchingCardNumbers);
                threeKindCount += 1;
                return["Three of a Kind", highestCard, valueMatch];
            }
        }
    }

    //Two pair
    
    if(matchingCardNumbers.length >= 4)
    {
        if(matchingCardNumbers[0] === matchingCardNumbers[1])
        {
            if(matchingCardNumbers[matchingCardNumbers.length - 1] === 
                matchingCardNumbers[matchingCardNumbers.length -2])
            { //Two pair success
                valueMatch = matchingCardNumbers[matchingCardNumbers.length - 1];
                highestCard = findHighestCard(allCardNumbers, "Match", matchingCardNumbers);
                twoPairCount += 1;
                return["Two Pair", highestCard, valueMatch];
                
            }
        }
    }
    
    //Pair

    if(matchingCardNumbers.length >= 2)
    {
        valueMatch = matchingCardNumbers[matchingCardNumbers.length - 1];
        highestCard = findHighestCard(allCardNumbers, "Match", matchingCardNumbers);
        pairCount += 1;
        return ["Pair", highestCard, valueMatch];
    }
    
    //No match. Return just the highest card
    highestCard = findHighestCard(allCardNumbers, "noMatch");
    highCount += 1;
    return [numberRankings[highestCard], highestCard];
            
}
//

//Main function to shuffle cards and redo the scoring process
async function redraw(repeat) //Repeat = true or false. 
{
    if(loopButton.textContent === "Loop") //Loop button not clicked
    {
        redrawButton.disabled = true;
    }
    let url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    first_player_background.style.backgroundColor = "green";
    second_player_background.style.backgroundColor = "green";

    await fetch(url)
    .then((resp) => resp.json())
    .then(async function(res) 
    {

        let deck_id = res.deck_id;
        url = "https://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=10"

        await fetch(url)
        .then((resp) => resp.json())
        .then(res =>
        {
            for(let i=0;i<5;i++)
            {
                first_player_hand.push(res.cards[i]);
                second_player_hand.push(res.cards[i+5]);
            }

            //Testing
            
            /* first_player_hand[0].suit = "SPADES";
            first_player_hand[1].suit = "SPADES";
            first_player_hand[2].suit = "SPADES";
            first_player_hand[3].suit = "SPADES";
            first_player_hand[4].suit = "SPADES"; */
            
            /* 
            first_player_hand[0].value = "10";
            first_player_hand[1].value = "JACK";
            first_player_hand[2].value = "QUEEN";
            first_player_hand[3].value = "KING";
            first_player_hand[4].value = "ACE"; */

            //
            
            
            //Set Images
            document.getElementById("player_one_score").innerHTML = "TBD";
            document.getElementById("player_two_score").innerHTML = "TBD";
            
            if(!repeat)
            {
                document.getElementById("player_one_card_one").setAttribute("src",first_player_hand[0].image);
                document.getElementById("player_two_card_one").setAttribute("src",second_player_hand[0].image);
                document.getElementById("player_one_card_two").setAttribute("src",first_player_hand[1].image);
                document.getElementById("player_two_card_two").setAttribute("src",second_player_hand[1].image);
                document.getElementById("player_one_card_three").setAttribute("src",first_player_hand[2].image);
                document.getElementById("player_two_card_three").setAttribute("src",second_player_hand[2].image);
                document.getElementById("player_one_card_four").setAttribute("src",first_player_hand[3].image);
                document.getElementById("player_two_card_four").setAttribute("src",second_player_hand[3].image);
                document.getElementById("player_one_card_five").setAttribute("src",first_player_hand[4].image);
                document.getElementById("player_two_card_five").setAttribute("src",second_player_hand[4].image);  
            }
            
            //

            //Determine score and rank
            first_player_score = scoreHand(first_player_hand);
            second_player_score = scoreHand(second_player_hand);
            first_player_rank = cardRankings.indexOf(first_player_score[0]);
            second_player_rank = cardRankings.indexOf(second_player_score[0]);
            totalDraws += 2;
            totalDrawText.textContent = "Total Draws: " + totalDraws;
            //
            
            //Determine Winners ---
            if(!repeat)
            {
                if(first_player_rank === second_player_rank) 
                { //Same ranking. Determine winner using highest card
                    if(first_player_score[2] === second_player_score[2]) //The top number of the rank
                    {
                        let first_player_high = first_player_score[1];
                        let second_player_high = second_player_score[1]; //Winner determined by remaining high card
                        if(first_player_high !== second_player_high) //Not a tie
                        {
                            if(first_player_high > second_player_high)
                            {
                                first_player_background.style.backgroundColor = "black";
                                first_player_score[0] += " (Winner)";
                            }
                            else if (second_player_high > first_player_high)
                            {
                                second_player_background.style.backgroundColor = "black";
                                second_player_score[0] += " (Winner)";
                            }
                        }
                        else //We have a tie!
                        {
                            first_player_score[0] += " (Tie)";
                            second_player_score[0] += " (Tie)";
                        }
                    }
                    else if(first_player_score[2] > second_player_score[2])
                    {
                        first_player_background.style.backgroundColor = "black";
                        first_player_score[0] += " (Winner)";
                    }
                    else if(second_player_score[2] > first_player_score[2])
                    {
                        second_player_background.style.backgroundColor = "black";
                        second_player_score[0] += " (Winner)";
                    }
                    
                }
                else if(first_player_rank > second_player_rank)
                {
                    first_player_background.style.backgroundColor = "black";
                    first_player_score[0] += " (Winner)";
                }

                else if(second_player_rank > first_player_rank)
                {
                    second_player_background.style.backgroundColor = "black";
                    second_player_score[0] += " (Winner)";
                }
                //---
                //Print results to user ---

                document.getElementById("player_one_score").innerHTML = first_player_score[0];
                document.getElementById("player_two_score").innerHTML = second_player_score[0];
                console.log(first_player_score);
                console.log(second_player_score);   
            }
        });
    });
    first_player_hand = [];
    second_player_hand = [];
    
    if(loopButton.textContent === "Loop")
    {
        redrawButton.disabled = false; 
    }
}

//Automatically start with one draw
redraw(false);
//
redrawButton.addEventListener("click", () => {redraw(false) });

//Setting up loop functionality
loopButton.onclick = () =>
{
    if(loopButton.textContent === "Loop")
    {
        loopButton.textContent = "Stop Loop";
        redrawButton.disabled = true;
        statsButton.disabled = true;
        loopInterval = setInterval(() => {redraw(false)}, 200);
    }
    else if(loopButton.textContent === "Stop Loop")
    {
        clearInterval(loopInterval)
        redrawButton.disabled = false;
        statsButton.disabled = false;
        loopButton.textContent = "Loop";
    }
};
//

//Statistics functionality
function stats()
{
    let message = "";
    message += `Total Draws:  ${totalDraws}\n`;
    message += `Royal Flush:  ${royalFlushCount} (${parseFloat(royalFlushCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Straight Flush:  ${straightFlushCount} (${parseFloat(straightFlushCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Four of a Kind:  ${fourKindCount} (${parseFloat(fourKindCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Full House:  ${fullHouseCount} (${parseFloat(fullHouseCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Flush:  ${flushCount} (${parseFloat(flushCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Straight:  ${straightCount} (${parseFloat(straightCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Three of a Kind:  ${threeKindCount} (${parseFloat(threeKindCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Two Pair:  ${twoPairCount} (${parseFloat(twoPairCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `Pair:  ${pairCount} (${parseFloat(pairCount/totalDraws * 100).toFixed(2)}%)\n`;
    message += `No Match:  ${highCount} (${parseFloat(highCount/totalDraws * 100).toFixed(2)}%)\n`;
    window.alert(message);
}

statsButton.addEventListener("click", stats);
//