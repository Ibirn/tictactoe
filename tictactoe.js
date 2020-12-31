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
  // let move;
  console.log("BLOCK CHECKING: ", plays);
  if (
    (plays.match(/1/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/1\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/1\b/))[0];
  } else if (
    (plays.match(/2/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/2\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/2\b/))[0];
  } else if (
    (plays.match(/3/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/3\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/3\b/))[0];
  } else if (
    (plays.match(/A/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/A\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/A\b/))[0];
  } else if (
    (plays.match(/B/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/B\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/B\b/))[0];
  } else if (
    (plays.match(/C/g) || []).length === 2 &&
    possibleMoves.filter((e) => e.match(/C\b/))
  ) {
    return possibleMoves.filter((e) => e.match(/C\b/))[0];
  } else if (
    (plays.match(/^(?=.*A1)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("C3")
  ) {
    return "C3";
  } else if (
    (plays.match(/^(?=.*C3)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("A1")
  ) {
    return "A1";
  } else if (
    (plays.match(/^(?=.*C1)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("A3")
  ) {
    return "A3";
  } else if (
    (plays.match(/^(?=.*A3)(?=.*B2)/g) || []).length === 1 &&
    possibleMoves.includes("C1")
  ) {
    return "C1";
  } else if (
    (plays.match(/^(?=.*A3)(?=.*C1)/g) || []).length === 1 &&
    possibleMoves.includes("B2")
  ) {
    return "B2";
  } else if (
    (plays.match(/^(?=.*A1)(?=.*C3)/g) || []).length === 1 &&
    possibleMoves.includes("B2")
  ) {
    return "B2";
  } else {
    return null;
  }
};

const compTurnHard = () => {
  console.log("PLAYING HARD");
  return new Promise((resolve, reject) => {
    let move;
    if (block(playPositions)) {
      move = block(playPositions);
    } else {
      move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
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
