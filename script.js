
let board = Array(9).fill("");
let gameActive = false;
let mode = "pvp";
let currentPlayer = "X";

const statusText = document.getElementById("status");
const boardDiv = document.getElementById("board");

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ---------------- START GAME ---------------- */

function startGame(selectedMode) {
  mode = selectedMode;

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  resetGame();
}

/* ---------------- MENU ---------------- */

function goMenu() {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

/* ---------------- RESET ---------------- */

function resetGame() {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusText.innerText = "Turn: X";
  createBoard();
}

/* ---------------- BOARD ---------------- */

function createBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.innerText = cell;

    if (cell !== "") div.classList.add("pop");

    div.onclick = () => handleClick(i);
    boardDiv.appendChild(div);
  });
}

/* ---------------- CLICK ---------------- */

function handleClick(i) {
  if (!gameActive || board[i] !== "") return;

  board[i] = currentPlayer;
  createBoard();

  if (checkWin()) return;

  if (mode === "pvp") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = "Turn: " + currentPlayer;
  } else {
    currentPlayer = "O";
    setTimeout(cpuMove, 200);
  }
}

/* ---------------- CPU (IMPOSSIBLE AI) ---------------- */

function cpuMove() {
  let move = bestMove();
  board[move] = "O";

  createBoard();

  if (checkWin()) return;

  currentPlayer = "X";
  statusText.innerText = "Your Turn (X)";
}

/* ---------------- MINIMAX (UNBEATABLE) ---------------- */

function bestMove() {
  let best = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";

      if (score > best) {
        best = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(b, depth, isMax) {

  if (winner("O")) return 10 - depth;
  if (winner("X")) return depth - 10;
  if (!b.includes("")) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth+1, false));
        b[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth+1, true));
        b[i] = "";
      }
    }
    return best;
  }
}

/* ---------------- WIN CHECK ---------------- */

function winner(p) {
  return winConditions.some(([a,b,c]) =>
    board[a] === p && board[b] === p && board[c] === p
  );
}

/* ---------------- CHECK WIN ---------------- */

function checkWin() {

  for (let c of winConditions) {
    let [a,b,c2] = c;

    if (board[a] && board[a] === board[b] && board[a] === board[c2]) {

      highlight(c);

      statusText.innerText = board[a] + " Wins 🎉";

      gameActive = false;

      // 🏆 CONFETTI
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // SCREEN FLASH
      document.body.classList.add("flash");
      setTimeout(() => document.body.classList.remove("flash"), 400);

      return true;
    }
  }

  if (!board.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
  }

  return false;
}

/* ---------------- HIGHLIGHT ---------------- */

function highlight(line) {
  const cells = document.querySelectorAll(".cell");
  line.forEach(i => cells[i].classList.add("win"));
}