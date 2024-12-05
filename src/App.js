import { useState } from 'react';
import './App.css'; // 引入 CSS 样式文件

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = (squares.filter(Boolean).length % 2 === 0) ? 'X' : 'O'; // 当前玩家的标记
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'}`;

  return (
    <>
      <div className="status">{status}</div>
      {/* 生成 15x15 的棋盘 */}
      {[...Array(15)].map((_, row) => (
        <div className="board-row" key={row}>
          {[...Array(15)].map((_, col) => (
            <Square key={col} value={squares[row * 15 + col]} onSquareClick={() => handleClick(row * 15 + col)} />
          ))}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]); // 15x15 棋盘
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(225).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={resetGame}>Restart Game</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 勝利邏輯：檢查五個相同棋子的連續性
function calculateWinner(squares) {
  const lines = [];
  // 检查行、列和对角线
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      if (col < 11) lines.push([row * 15 + col, row * 15 + col + 1, row * 15 + col + 2, row * 15 + col + 3, row * 15 + col + 4]); // 水平
      if (row < 11) lines.push([row * 15 + col, (row + 1) * 15 + col, (row + 2) * 15 + col, (row + 3) * 15 + col, (row + 4) * 15 + col]); // 垂直
      if (row < 11 && col < 11) lines.push([row * 15 + col, (row + 1) * 15 + col + 1, (row + 2) * 15 + col + 2, (row + 3) * 15 + col + 3, (row + 4) * 15 + col + 4]); // 主对角线
      if (row < 11 && col > 3) lines.push([row * 15 + col, (row + 1) * 15 + col - 1, (row + 2) * 15 + col - 2, (row + 3) * 15 + col - 3, (row + 4) * 15 + col - 4]); // 副对角线
    }
  }
  for (const line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
