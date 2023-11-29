type Cell = "X" | "O" | " ";
type Board = Cell[][];
type Player = "X" | "O";
type Winner = Player | "Empate" | null;

const scores: { [key in any]: number } = {
  X: 1,
  O: -1,
  Empate: 0,
};

const ai: Player = "X";
const human: Player = "O";

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  let winner: Winner = checkWinner(board);
  if (winner !== null) {
    return scores[winner];
  }

  if (isMaximizing) {
    let bestScore: number = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = ai;
          let score: number = minimax(board, depth + 1, false);
          board[i][j] = " ";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore: number = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = human;
          let score: number = minimax(board, depth + 1, true);
          board[i][j] = " ";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function checkWinner(board: Board): Winner {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== " "
    ) {
      return board[i][0] as Player;
    }

    if (
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== " "
    ) {
      return board[0][i] as Player;
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== " "
  ) {
    return board[0][0] as Player;
  }

  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== " "
  ) {
    return board[0][2] as Player;
  }

  if (board.every((row) => row.every((cell) => cell !== " "))) {
    return "Empate";
  } else {
    return null;
  }
}

let board: Board = [
  ["X", "O", "X"],
  ["X", "O", " "],
  [" ", " ", "O"],
];

let bestMove: { i: number; j: number } | undefined;
let bestScore: number = -Infinity;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (board[i][j] === " ") {
      board[i][j] = ai;
      let score: number = minimax(board, 0, false);
      board[i][j] = " ";
      if (score > bestScore) {
        bestScore = score;
        bestMove = { i, j };
      }
    }
  }
}

console.log("Melhor movimento para X:", bestMove, "Com pontuação:", bestScore);
