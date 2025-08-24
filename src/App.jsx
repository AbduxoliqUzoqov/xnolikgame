import { useState, useEffect } from "react";
import "./App.css";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function App() {
   const boardEl = document.getElementById('board');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState("pvp"); // pvp yoki cpu

  useEffect(() => {
    if (!xIsNext && mode === "cpu" && !winner) {
      setTimeout(cpuMove, 400);
    }
  }, [xIsNext, mode, winner]);

  function checkWinner(bd) {
    for (let [a, b, c] of WIN_LINES) {
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
        return  { status: 'win', player: bd[a], line: [a,b,c] };
      }
    }
    if (bd.every(Boolean)) return  { status: 'draw' };
    return {status: null};
  }

  function handleClick(i) {
    if (board[i] || winner) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if(res.status=="win"){ setWinner(res.player);
      highlight(res.line)
    }else if(res.status=="draw") setWinner("draw")
    setXIsNext(!xIsNext);
  }

  function cpuMove() {
    const me = "O", you = "X";
    const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (empty.length === 0) return;

    // 1) g'alabaga urinish
    for (let i of empty) {
      const copy = board.slice();
      copy[i] = me;
      if (checkWinner(copy).player === me) return handleClick(i);
    }
    // 2) bloklash
    for (let i of empty) {
      const copy = board.slice();
      copy[i] = you;
      if (checkWinner(copy).player === you) return handleClick(i);
    }
    // 3) markaz
    if (empty.includes(4)) return handleClick(4);
    // 4) burchak
    const corners = empty.filter((i) => [0, 2, 6, 8].includes(i));
    if (corners.length) return handleClick(corners[Math.floor(Math.random() * corners.length)]);
    // 5) qolgan joy
    return handleClick(empty[Math.floor(Math.random() * empty.length)]);
  }
   function highlight(line){
      line.forEach(i => boardEl.children[i].classList.add('win'));
    }
  function restart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    [...boardEl.children].forEach(c => c.classList.remove('win'));
  }

  return (
    <div className="app">
      <div class="title">
         X/O 🎮 <span class="badge">Abduxoliq</span>
      </div>
      <div className="controls">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="pvp">2 o'yinchi</option>
          <option value="cpu">Kompyuter</option>
        </select>
        <button onClick={restart}>🔄 Qayta boshlash</button>
      </div>

      <div className="status">
        {winner === "draw"
          ? "🤝 Durrang!"
          : winner
          ? `🥇 G'olib: ${winner}`
          : `Navbat: ${xIsNext ? "X" : "O"}`}
      </div>

      <div id="board" className="board">
        {board.map((cell, i) => (
          <button key={i} className="cell" onClick={() => handleClick(i)}>
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

/* 📌 CSS uchun: src/App.css */
/* Mobilga moslangan dizayn */
