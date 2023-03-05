import { useState } from "react";
import confetti from "canvas-confetti";

const TURNS = {
  X: "X",
  O: "O",
};

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;

  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  //tablero
  const [board, setBoard] = useState(
    Array(9).fill(null) //componente separaado de la app para re utilizar
  );
  // console.log(board)

  const [turn, setTurn] = useState(TURNS.X);

  const [Winner, setWinner] = useState(null);

  const checkWinner = (boardToCheck) => {
    //revisamos todas las convinaciones ganadoras
    //para ver si x u O gano
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    //si no hay ganador null
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };
  const checkEndGame = (newBoard) => {
    return newBoard.every((Square) => Square !== null);
  };

  const updateBoard = (index) => {
    if (board[index] || Winner) return; //no actualiza la posicion si tiene algo

    // actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn; //x u o
    setBoard(newBoard);

    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //revisa si hay ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(() => {
        return newWinner;
      });
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };

  return (
    <main className="board">
      <h1>Tres en línea</h1>
      <button onClick={resetGame}>Reset</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard} //le pasamos la funcion, para ejecutarlo cuando queramos al updateBoard
            >
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {Winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{Winner === false ? "Tie" : "winner: "}</h2>

            <header className="win">
              {Winner && <Square>{Winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>New game</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
