const boardSize = 36;
const snakes = { 23: 3, 33: 6, 31: 21 };
const ladders = { 4: 22, 7: 18, 12: 25, 17: 30 };
const mysteryPrizes = [2, 34];

let players = { player: 1 }; // Store players' positions

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function movePlayer(player) {
    let roll = rollDice();
    let newPosition = players[player] + roll;

    if (newPosition > boardSize) {
        document.getElementById("game-message").innerText = `${player}, you need an exact roll to finish!`;
        return;
    }

    players[player] = newPosition;

    if (mysteryPrizes.includes(newPosition)) {
        document.getElementById("game-message").innerText = `${player}, you won a mystery prize! You will receive it on results day.`;
    }

    if (snakes[newPosition]) {
        players[player] = snakes[newPosition];
        document.getElementById("game-message").innerText = `${player} got bitten by a snake! Moved to ${players[player]}`;
    }

    if (ladders[newPosition]) {
        players[player] = ladders[newPosition];
        document.getElementById("game-message").innerText = `${player} climbed a ladder! Moved to ${players[player]}`;
    }

    document.getElementById("player-position").innerText = `Player Position: ${players[player]}`;

    if (players[player] === boardSize) {
        document.getElementById("game-message").innerText = `${player} has won the game!`;
        saveToLeaderboard(player);
    }
}

function saveToLeaderboard(player) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ player, date: new Date().toISOString() });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log(`Leaderboard updated!`);
}

function playTurn() {
    movePlayer("player");
}
