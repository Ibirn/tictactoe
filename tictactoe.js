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
let xPositions = "";
let oPositions = "";
let turnCount = 0;
let illegalMove = false;

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
rl.write("Welcome to Tic Tac Toe!\n Are you ready to play?\n");
drawBoard();

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
    // console.log("COMPMOVES: ", possibleMoves);
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
      "O"
    );
    oPositions += move;
    removePossibleMove(move);
    resolve();
    process.stdout.write("Computer is playing...\n");
    drawBoard();
    checkWin(oPositions);
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
          "X"
        );
        removePossibleMove(move);
        xPositions += move;
        resolve();
        checkWin(xPositions);
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

const runGame = async () => {
  if (complete === false) {
    await turn();
    if (complete === false && illegalMove === false) {
      await compTurn();
    }
    runGame();
  } else {
    rl.close();
  }
};

runGame();
