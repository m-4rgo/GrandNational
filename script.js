const boardSize = 36;
const snakes = { 23: 3, 33: 6, 31: 21 };
const ladders = { 4: 22, 7: 18, 12: 25, 17: 30 };
const mysteryPrizes = [2, 34];

// store player's number of dice rolls
let numberOfRolls = 0;
// Store players' positions
let players = { player: 1 };
// records the player's game history
let gameLog = [];
let gameEnd = Boolean(false);

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(player) {
    document.getElementById("game-message").innerText = `Important game messages will appear here.`
    // increments the roll counter by 1
    numberOfRolls += 1;
    // instantiates local variable roll which contains the roll information for this turn
    let roll = rollDice();
    // adjusts the player's board position by adding the dice roll
    let newPosition = players[player] + roll;

    // prints the dice roll and total number of rolls so far
    document.getElementById("roll-feedback").innerText = `${player}, you rolled a ${roll}, you have made ${numberOfRolls} rolls`;

    // enforces finishing rule of exact roll to finish
    if (newPosition > boardSize) {
        gameLog.push(`${player} rolled a ${roll} and could not finish.`);
        document.getElementById("game-message").innerText = `${player}, you need an exact roll to finish!`;
        //updates the game log.
        updateGameLog();
        return;
    }

    // sets new board position of player
    players[player] = newPosition;
    // records move to game history
    gameLog.push(`${player} rolled ${roll} and moved to ${newPosition}`);

    if (mysteryPrizes.includes(newPosition)) {
        document.getElementById("game-message").innerText = `${player}, you won a mystery prize! You will receive it on results day.`;
        gameLog.push(`${player} won a mystery prize from tile ${newPosition}`);
    }

    if (snakes[newPosition]) {
        players[player] = snakes[newPosition];
        document.getElementById("game-message").innerText = `${player} got bitten by a snake! Moved to ${players[player]}`;
        gameLog.push(`${player} was bitten by a snake on tile ${newPosition} and moved back to tile ${players[player]}`);
    }

    if (ladders[newPosition]) {
        players[player] = ladders[newPosition];
        document.getElementById("game-message").innerText = `${player} climbed a ladder! Moved to ${players[player]}`;
        gameLog.push(`${player} climbed a ladder from ${newPosition} to position ${players[player]}`);
    }

    document.getElementById("player-position").innerText = `You are on square ${players[player]}`;


    if (players[player] === boardSize) {
        document.getElementById("game-message").innerText = `${player} has won the game!`;
        document.getElementById("game-message").innerText = `${player} used ${numberOfRolls} rolls to win`;
        gameLog.push(`Game ends with ${numberOfRolls} rolls.`)
        gameEnd = true;
        saveToLeaderboard(player);
    }

    //updates the game log.
    updateGameLog();
}

function saveToLeaderboard(player) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ player, date: new Date().toISOString() });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log(`Leaderboard updated!`);
}

function updateGameLog() {
    let historyElement = document.getElementById("game-log");
    historyElement.innerHTML = gameLog.map(event => `<p>${event}</p>`).join("");
}


function playTurn() {
    if (gameEnd === true) {
        document.getElementById("game-message").innerText = `Stop playing! The game is over <3`
        return
    }
    movePlayer("player");
}
