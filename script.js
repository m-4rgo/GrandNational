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
//records if the game has ended
let gameEnd = Boolean(false);
//records number of mystery prizes won
let prizeWin = 0;
// records if the game has started (cannot submit details mid-game)
let gameStart = Boolean(false);
// records whether the player has entered their details for the live attempt
let formSubmitted = Boolean(false);

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

    // mystery prize event
    if (mysteryPrizes.includes(newPosition)) {
        document.getElementById("game-message").innerText = `${player}, you won a mystery prize! You will receive it on race results day.`;
        gameLog.push(`${player} won a mystery prize from tile ${newPosition}`);
        prizeWin += 1;
    }

    // snake event
    if (snakes[newPosition]) {
        players[player] = snakes[newPosition];
        document.getElementById("game-message").innerText = `${player} got bitten by a snake! Moved to ${players[player]}`;
        gameLog.push(`${player} was bitten by a snake on tile ${newPosition} and moved back to tile ${players[player]}`);
    }

    // ladder event
    if (ladders[newPosition]) {
        players[player] = ladders[newPosition];
        document.getElementById("game-message").innerText = `${player} climbed a ladder! Moved to ${players[player]}`;
        gameLog.push(`${player} climbed a ladder from ${newPosition} to position ${players[player]}`);
    }

    document.getElementById("player-position").innerText = `You are on square ${players[player]}`;

    // endgame event
    if (players[player] === boardSize) {
        // document.getElementById("game-message").innerText = `${player} and their rat have crossed the line!`;
        document.getElementById("game-message").innerText = `${player} and their rat have crossed the line! They used ${numberOfRolls} rolls to finish.`;
        gameLog.push(`Game ends with ${numberOfRolls} rolls, and ${prizeWin} mystery prizes won.`)
        gameEnd = true;
        //if details saved is true then:
        // saveToLeaderboard(player);
        if (formSubmitted === true) {
            submitEntry(player);
        }
    }

    //updates the game log.
    updateGameLog();
//     closes the move player function and ends the turn
}

// todo: remember to add another elif for when a final game has already been submitted
// todo: that says something like "you already submitted your final run"
function saveDetails() {
    // save details into variables
    let username = document.getElementById("name").value;
    let rat = document.getElementById("rat").value;
    let userUrl = document.getElementById("profile-link").value;
    let ratUrl = document.getElementById("rat-link").value;
    // let playerDetails = null;

    // checks if a game has already started
    if (gameStart === true) {
        document.getElementById("details-saved").innerText = "You can't save or change your details now, the practice run has already started. " +
            "\n\n If you entered your details incorrectly, you must finish the run and contact pond about the error. This run will still count as your final attempt!" +
            "\nIf this is a practice run, finish the run or refresh the page to start again."
    } else {
        // todo: check that all form fields are filled (not working)
        // if (!name) {
        //     alert("Please fill out the name field.");
        //     return;
        // }
        //print details to screen
        formSubmitted = true;
        let playerDetails = `Username: ${username}
            User Link: ${userUrl} 
            Rat Name: ${rat}
            Rat Link: ${ratUrl}`;
        // print screen "your details have been saved and your attempt is being recorded. If you decide to play again, only your first attempt will be recorded."
        document.getElementById("details-saved").innerText = `Your details were saved. This is your real attempt! \n\n` +
            `When the game has finished, you will be redirected while your results are submitted to the server. \n\nYou may need to enter a Captcha (sorry).` +
            `\n\nThese are the details you are entering with: \nScreenshot or copy/paste these details and add them to the GrandNational oekaki topic to notify us that you have entered!\nmake sure they are correct before pressing the dice roll button, you won't be able to change them after:` +
            `\n\n ${playerDetails}`
    }
    // return playerDetails;
}

// submits the entry to the server, redirects user to form captcha page
function submitEntry() {
    // let playerDetails = `Username: ${username}, Rat Name: ${rat}`;
    // let gameData = `Game Log:\n${gameLog.join("\n")}\n\nTotal Rolls: ${numberOfRolls}, Prizes Won: ${prizeWin}`;
    document.getElementById("entryForm").submit();
}

// saves the run to the local leaderboard
function saveToLeaderboard(player) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ player, date: new Date().toISOString() });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    console.log(`Leaderboard updated!`);
}

// Updates the game log with each new move or event
function updateGameLog() {
    let logEntry = document.getElementById("game-log");
    logEntry.innerHTML = gameLog.map(event => `<p>${event}</p>`).join("");
}

// starts the turn for the player
function playTurn() {
    if (gameStart === false) {
        gameStart = true;
        gameLog.push(`Game started:`)
        updateGameLog();
    }
    if (gameEnd === true) {
        document.getElementById("game-message").innerText = `Stop playing! The game is over <3`
        return
    }
    movePlayer("player");
}
