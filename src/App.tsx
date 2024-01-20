import "./App.css";
import { useEffect, useState } from "react";
import bombIcon from "./assets/bombIcon.png";

interface BoardBomb {
  isBomb: boolean;
  adjacentesBombs: number;
  isSelected: boolean;
}

const Board = ({ size }: { size: number }) => {
  const [board, setBoard] = useState<BoardBomb[][]>([[]]);
  const [gameOver, setGameOver] = useState({
    hasFirstClick: false,
    gameOver: false,
  });

  useEffect(() => {
    const createBoard = () => {
      const newBoard = Array.from({ length: size }, () =>
        Array.from({ length: size }, () =>
          Math.random() < 0.3
            ? { isBomb: true, adjacentesBombs: 0, isSelected: false }
            : { isBomb: false, adjacentesBombs: 0, isSelected: false }
        )
      );
      console.log(newBoard);
      setBoard(newBoard);
    };

    createBoard();
  }, [size]);

  const handleClickCell = ({
    selectedColumnIndex,
    selectedRowIndex,
  }: {
    selectedColumnIndex: number;
    selectedRowIndex: number;
  }) => {
    if (gameOver.gameOver) return;

    let adjacentesBombsCounter = 0;
    const selectedCellValue = board[selectedColumnIndex][selectedRowIndex];

    if (gameOver.hasFirstClick) {
      if (selectedCellValue.isBomb) {
        setGameOver({ ...gameOver, gameOver: true });
      }
    } else {
      setGameOver({ ...gameOver, hasFirstClick: true });
    }

    const mappedAdjacentsBombsBoard = board.map((column, columnIndex) => {
      return column.map((row, rowIndex) => {
        if (
          columnIndex === selectedColumnIndex ||
          columnIndex + 1 === selectedColumnIndex ||
          columnIndex - 1 === selectedColumnIndex
        ) {
          if (
            rowIndex === selectedRowIndex ||
            rowIndex - 1 === selectedRowIndex ||
            rowIndex + 1 === selectedRowIndex
          ) {
            if (
              selectedColumnIndex === columnIndex &&
              selectedRowIndex === rowIndex
            )
              return {
                ...row,
                ...(!gameOver.hasFirstClick ? { isBomb: false } : {}),
                isSelected: true,
              };
            if (row.isBomb) adjacentesBombsCounter += 1;
          }
        }
        return row;
      });
    });

    mappedAdjacentsBombsBoard[selectedColumnIndex][
      selectedRowIndex
    ].adjacentesBombs = adjacentesBombsCounter;

    setBoard(mappedAdjacentsBombsBoard);
  };

  const handleDisplayCellValue = (row: BoardBomb) => {
    if (row.isSelected) {
      if (row.isBomb) return <img className="cell" src={bombIcon} />;
      return row.adjacentesBombs;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="board">
        {board.map((row, columnIndex) => (
          <div key={columnIndex}>
            {row.map((row, rowIndex) => {
              return (
                <div
                  onClick={() => {
                    handleClickCell({
                      selectedColumnIndex: columnIndex,
                      selectedRowIndex: rowIndex,
                    });
                  }}
                  key={columnIndex + rowIndex}
                  className={`cell`}
                >
                  {handleDisplayCellValue(row)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {gameOver.gameOver && (
        <button
          onClick={() => {
            location.reload();
          }}
        >
          GAME OVER - REINICIAR
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="container">
      <Board size={10} />
    </div>
  );
}

export default App;
