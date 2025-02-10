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

loadGameState();

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
    if (formSubmitted === true) {
        saveGameState();
    }
}

// todo: remember to add another elif for when a final game has already been submitted
// todo: that says something like "you already submitted your final run"
// saves the details that the player entered and prints them to screen
function saveDetails() {
    // checks if a game has already started
    if (gameStart === true && formSubmitted === false) {
        document.getElementById("details-saved").innerText = "You can't save your details now, the practice run has already started. Refresh the page if you want to start your final attempt.";
    } else {
        // todo: check that all form fields are filled (not working)
        // if (!name) {
        //     alert("Please fill out the name field.");
        //     return;
        // }
        //print details to screen
        formSubmitted = true;
        // save details into variables
        let username = document.getElementById("name").value;
        let rat = document.getElementById("rat").value;
        let userUrl = document.getElementById("profile-link").value;
        let ratUrl = document.getElementById("rat-link").value;
        let playerDetails = `Username: ${username}
            User Link: ${userUrl} 
            Rat Name: ${rat}
            Rat Link: ${ratUrl}`;
        // print screen "your details have been saved and your attempt is being recorded. If you decide to play again, only your first attempt will be recorded."
        document.getElementById("details-saved").innerText = `Your details were saved. This is your real attempt! \n\n` +
            `When the game has finished, you will be redirected while your results are submitted to the server. \n\nYou may need to enter a Captcha (sorry).` +
            `\n\nThese are the details you are entering with: \nScreenshot or copy/paste these details and add them to the GrandNational oekaki topic to notify us that you have entered!\nmake sure they are correct before pressing the dice roll button, you won't be able to change them after the game ends:` +
            `\n\n ${playerDetails}`;
        saveGameState();
    }
}

// submits the entry to the server, redirects user to form captcha page
function submitEntry() {
    // let playerDetails = `Username: ${username}, Rat Name: ${rat}`;
    // let gameData = `Game Log:\n${gameLog.join("\n")}\n\nTotal Rolls: ${numberOfRolls}, Prizes Won: ${prizeWin}`;

    // Gather the data you want to send
    let username = document.getElementById("name").value;
    let rat = document.getElementById("rat").value;
    let userUrl = document.getElementById("profile-link").value;
    let ratUrl = document.getElementById("rat-link").value;

    // Prepare the player details string
    let playerDetails = `Username: ${username}
                        User Link: ${userUrl} 
                        Rat Name: ${rat}
                        Rat Link: ${ratUrl}`;

    // Prepare the game log (you can include relevant game data here)
    let gameData = `Game Log:\n${gameLog.join("\n")}\n\nTotal Rolls: ${numberOfRolls}, Prizes Won: ${prizeWin}`;

    // Debugging: check the values before setting them
    // console.log("Player Details: ", playerDetails);
    // console.log("Game Data: ", gameData);

    // Set the hidden input fields
    document.getElementById("playerDetails").value = playerDetails;
    document.getElementById("gameData").value = gameData;

    // submit the form
    document.getElementById("entryForm").submit();
}

// checks if a form has been submitted, if so, cannot restart and must finish the game.
function saveGameState() {

    if (formSubmitted === true) {
        let username = document.getElementById("name").value;
        let rat = document.getElementById("rat").value;
        let userUrl = document.getElementById("profile-link").value;
        let ratUrl = document.getElementById("rat-link").value;

        let playerDetails = {
            username,
            rat,
            userUrl,
            ratUrl,
        };

        //save the message for if entry details have been saved
        let detailsSavedMessage = document.getElementById("details-saved").innerText; // Get the message


        let gameState = {
            players,
            numberOfRolls,
            gameLog,
            gameEnd,
            prizeWin,
            gameStart,
            formSubmitted,
            playerDetails,
            detailsSavedMessage,
        };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }
}

// loads the user's play data from their last session if they submitted an entry form.
function loadGameState() {

    let savedState = JSON.parse(localStorage.getItem("gameState"));
    if (savedState) {
        players = savedState.players;
        numberOfRolls = savedState.numberOfRolls;
        gameLog = savedState.gameLog;
        gameEnd = savedState.gameEnd;
        prizeWin = savedState.prizeWin;
        gameStart = savedState.gameStart;
        formSubmitted = savedState.formSubmitted;

        // Restore player details if they exist
        if (savedState.playerDetails) {
            document.getElementById("name").value = savedState.playerDetails.username;
            document.getElementById("rat").value = savedState.playerDetails.rat;
            document.getElementById("profile-link").value = savedState.playerDetails.userUrl;
            document.getElementById("rat-link").value = savedState.playerDetails.ratUrl;
        }

        // Restore the saved message in the "details-saved" element
        if (savedState.detailsSavedMessage) {
            document.getElementById("details-saved").innerText = savedState.detailsSavedMessage;
        }

        updateGameLog();
    }
}

// saves the run to the leaderboard
// function saveToLeaderboard(player) {
//     let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
//     leaderboard.push({ player, date: new Date().toISOString() });
//     localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
//     console.log(`Leaderboard updated!`);
// }

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
