const { resolve } = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

String.prototype.replaceAt = function (index, character) {
  return (
    this.substr(0, index) + character + this.substr(index + character.length)
  );
};

let complete = false;
let gameBoard = {
  header: `    1  2  3 \n`,
  rowA: ` A [ ][ ][ ]\n`,
  rowB: ` B [ ][ ][ ]\n`,
  rowC: ` C [ ][ ][ ]\n`,
};
let possibleMoves = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let playPositions = "";
let compPositions = "";
let turnCount = 0;
let illegalMove = false;
let playerChoice = true; //true = X, false = O
let difficulty = false;

const removePossibleMove = (value) => {
  let index = possibleMoves.indexOf(value);
  if (index > -1) {
    possibleMoves.splice(index, 1);
  }
  return possibleMoves;
};

const drawBoard = () => {
  process.stdout.write(
    gameBoard.header + gameBoard.rowA + gameBoard.rowB + gameBoard.rowC
  );
};

const checkWin = (player) => {
  let columnA = (player.match(/1/g) || []).length;
  let columnB = (player.match(/2/g) || []).length;
  let columnC = (player.match(/3/g) || []).length;
  let rowA = (player.match(/A/g) || []).length;
  let rowB = (player.match(/B/g) || []).length;
  let rowC = (player.match(/C/g) || []).length;
  let diagA = (player.match(/^(?=.*A1)(?=.*B2)(?=.*C3).*$/im) || []).length;
  let diagB = (player.match(/^(?=.*A3)(?=.*B2)(?=.*C1).*$/im) || []).length;
  if (
    columnA >= 3 ||
    columnB >= 3 ||
    columnC >= 3 ||
    rowA >= 3 ||
    rowB >= 3 ||
    rowC >= 3 ||
    diagA >= 1 ||
    diagB >= 1
  ) {
    process.stdout.write(`${turnCount % 2 ? "O" : "X"} has won!\n`);
    complete = true;
  } else if (possibleMoves.length === 0) {
    process.stdout.write("There are no winners.\n");
    complete = true;
  }
};

const compTurn = () => {
  return new Promise((resolve, reject) => {
    let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    let temp = 0;
    if (move[1] === "1") {
      temp = 4;
    } else if (move[1] === "2") {
      temp = 7;
    } else if (move[1] === "3") {
      temp = 10;
    } else {
      temp = -1;
    }
    gameBoard[`row${move[0]}`] = gameBoard[`row${move[0]}`].replaceAt(
      temp,
      playerChoice ? "O" : "X"
    );
    compPositions += move;
    removePossibleMove(move);
    resolve();
    process.stdout.write("Computer is playing...\n");
    drawBoard();
    checkWin(compPositions);
    turnCount += 1;
  });
};

const turn = () => {
  return new Promise((resolve, reject) => {
    rl.question("Please choose a coordinate: ", (move) => {
      let index = possibleMoves.indexOf(move);
      if (index >= 0) {
        let temp = 0;
        if (move[1] === "1") {
          temp = 4;
        } else if (move[1] === "2") {
          temp = 7;
        } else if (move[1] === "3") {
          temp = 10;
        } else {
          temp = -1;
        }
        gameBoard[`row${move[0]}`] = gameBoard[`row${move[0]}`].replaceAt(
          temp,
          playerChoice ? "X" : "O"
        );
        removePossibleMove(move);
        playPositions += move;
        resolve();
        checkWin(playPositions);
        turnCount += 1;
        drawBoard();
        illegalMove = false;
      } else {
        process.stdout.write(
          "That space has already been played. \nPlease choose another.\n"
        );
        illegalMove = true;
        resolve();
        drawBoard();
      }
    });
  });
};

const block = (plays) => {
  let output;
  if (
    (plays.match(/1/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/1\b/))
  ) {
    console.log("1 CHECKED");
    output = possibleMoves.filter((e) => e.match(/1\b/))[0];
  }
  if (
    (plays.match(/2/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/2\b/))
  ) {
    console.log("2 CHECKED");
    output = possibleMoves.filter((e) => e.match(/2\b/))[0];
  }
  if (
    (plays.match(/3/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/3\b/))
  ) {
    console.log("3 CHECKED");
    output = possibleMoves.filter((e) => e.match(/3\b/))[0];
  }
  if (
    (plays.match(/A/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/\bA/))
  ) {
    console.log("A CHECKED");
    output = possibleMoves.filter((e) => e.match(/\bA/))[0];
  }
  if (
    (plays.match(/B/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/\bB/))
  ) {
    console.log("B CHECKED ");
    output = possibleMoves.filter((e) => e.match(/\bB/))[0];
  }
  if (
    (plays.match(/C/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/\bC/))
  ) {
    console.log("C CHECKED");
    output = possibleMoves.filter((e) => e.match(/\bC/))[0];
  }
  if (
    (plays.match(/^(?=.*A1)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("C3")
  ) {
    console.log("A1B2 CHECKED");
    output = "C3";
  }
  if (
    (plays.match(/^(?=.*C3)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("A1")
  ) {
    console.log("C3B2 CHECKED");
    output = "A1";
  }
  if (
    (plays.match(/^(?=.*C1)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("A3")
  ) {
    console.log("C1B2 CHECKED");
    output = "A3";
  }
  if (
    (plays.match(/^(?=.*A3)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("C1")
  ) {
    console.log("A3B2 CHECKED");
    output = "C1";
  }
  if (
    (plays.match(/^(?=.*A3)(?=.*C1)/g) || []).length === 1 &&
    possibleMoves.includes("B2")
  ) {
    console.log("A3C1 CHECKED");
    output = "B2";
  }
  if (
    (plays.match(/^(?=.*A1)(?=.*C3)/g) || []).length === 1 &&
    possibleMoves.includes("B2")
  ) {
    console.log("A1C3 CHECKED");
    output = "B2";
  }
  if (output) {
    return output;
  } else {
    return null;
  }
};

const compTurnHard = () => {
  return new Promise((resolve, reject) => {
    let move;

    if (turnCount === 0) {
      move = "B2";
    } else {
      move = block(compPositions)
        ? block(compPositions)
        : block(playPositions)
        ? block(playPositions)
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    let temp = 0;
    if (move[1] === "1") {
      temp = 4;
    } else if (move[1] === "2") {
      temp = 7;
    } else if (move[1] === "3") {
      temp = 10;
    } else {
      temp = -1;
    }
    gameBoard[`row${move[0]}`] = gameBoard[`row${move[0]}`].replaceAt(
      temp,
      playerChoice ? "O" : "X"
    );
    compPositions += move;
    removePossibleMove(move);
    resolve();
    process.stdout.write("Computer is playing...\n");
    drawBoard();
    checkWin(compPositions);
    turnCount += 1;
  });
};

rl.write("Welcome to Tic Tac Toe!\n");
rl.question("Would you like to play on (E)asy or (H)ard? ", (answer) => {
  if (answer === "E") {
    process.stdout.write("Excellent! ");
    firstTurn();
  } else if (answer === "H") {
    process.stdout.write("Good choice! ");
    difficulty = true;
    firstTurn();
  } else {
    process.stdout.write(
      "How uncooperative! You're playing on baby mode for babies.\n"
    );
    firstTurn();
  }
});

const firstTurn = () => {
  rl.question("Would you like to play as X or O? ", (answer) => {
    if (answer !== "X") {
      process.stdout.write("You are O.\n");
      playerChoice = false;
      difficulty ? compTurnHard() : compTurn();
      runGame();
    } else {
      process.stdout.write("You are X.\n");
      drawBoard();
      runGame();
    }
  });
};

const runGame = async () => {
  if (difficulty) {
    if (complete === false) {
      await turn();
      if (complete === false && illegalMove === false) {
        await compTurnHard();
      }
      runGame();
    } else {
      rl.close();
    }
  } else {
    if (complete === false) {
      await turn();
      if (complete === false && illegalMove === false) {
        await compTurn();
      }
      runGame();
    } else {
      rl.close();
    }
  }
};
