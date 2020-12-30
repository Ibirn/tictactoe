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

const compTurn = () => {
  console.log("COMPMOVES: ", possibleMoves);
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
  gameBoard[`row${move[0]}`] = gameBoard[`row${move[0]}`].replaceAt(temp, "O");
  removePossibleMove(move);
};

const turn = () => {
  return new Promise((resolve, reject) => {
    rl.question("Please choose a coordinate: ", (move) => {
      let index = possibleMoves.indexOf(move);
      console.log("INDEX: ", index, "\nPOSSMO: ", possibleMoves);
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
        resolve();
        compTurn();
        drawBoard();
        turn();
      } else {
        process.stdout.write(
          "That space has already been played. \nPlease choose another.\n"
        );
        resolve();
        drawBoard();
        turn();
      }
    });
  });
};

turn();

// drawBoard();
// runGame();
// //'use strict'

// const readline = require('readline')

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// const question1 = () => {
//   return new Promise((resolve, reject) => {
//     rl.question('q1 What do you think of Node.js? ', (answer) => {
//       console.log(`Thank you for your valuable feedback: ${answer}`)
//       resolve()
//     })
//   })
// }

// const question2 = () => {
//   return new Promise((resolve, reject) => {
//     rl.question('q2 What do you think of Node.js? ', (answer) => {
//       console.log(`Thank you for your valuable feedback: ${answer}`)
//       resolve()
//     })
//   })
// }

// const main = async () => {
//   await question1()
//   await question2()
//   rl.close()
// }

// main()
