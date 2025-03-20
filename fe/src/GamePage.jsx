import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false); // Track game-over state

  useEffect(() => {
    fetch(`http://localhost:5555/game/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        if (data.gameOver) {
          setGameOver(true);
          setMessage(data.message || "Game over.");
        }
      });
  }, [id]);

  const handleMove = async (move) => {
    if (gameOver) return; // Prevent moves if game over

    const response = await fetch("http://localhost:5555/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: id, move }),
    });

    const data = await response.json();
    if (data.error) {
      setError("❌ Invalid move! Try again.");
      setTimeout(() => setError(""), 2000); // Clear error after 2 seconds
    } else {
      setError(""); // Clear previous error
      setGame((prevGame) => ({ ...prevGame, fen: data.fen }));

      // Handle game over message
      if (data.message) {
        setMessage(data.message);
        setGameOver(true); // Lock board after game ends
      }
    }
  };

  if (!game) return <p>Loading game...</p>;

  return (
    <div>
      <h1>Game #{game.id}</h1>
      <p>FEN: {game.fen}</p>
      <p>Moves: {JSON.stringify(game.moves)}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Chessboard
        position={game.fen}
        boardWidth={600}
        animationDuration={300}
        onPieceDrop={(sourceSquare, targetSquare, extraProps) => {
          const move = {
            from: sourceSquare,
            to: targetSquare,
          };
          handleMove(move);
        }}
        draggable={!gameOver} // Disable moves when game over
        areArrowsAllowed={true}
        customBoardStyle={{
          borderRadius: "0.5rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779556" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
      />
      {message && (
        <div
          className="game-over-message"
          style={{ color: "green", fontWeight: "bold" }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
