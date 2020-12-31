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
