let gameBoard = {
  header: `    1  2  3 \n`,
  rowA: ` A [ ][ ][ ]\n`,
  rowB: ` B [ ][ ][ ]\n`,
  rowC: ` C [ ][ ][ ]\n`,
};
let possibleMoves = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let xPositions = "";
let oPositions = "";
let blockWin = false;

const block = (plays) => {
  // let move;
  // console.log(plays.match(/1/g));
  if (plays.match(/1/g).length === 2) {
    return possibleMoves.filter((e) => e.match(/1\b/))[0];
  }
};

const compTurnHard = () => {
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
    oPositions += move;
    removePossibleMove(move);
    resolve();
    process.stdout.write("Computer is playing...\n");
    drawBoard();
    checkWin(oPositions);
    turnCount += 1;
  });
};
