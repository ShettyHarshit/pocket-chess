import axios from "axios";
import { Chess } from "chess.js";
import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [lastAiMove, setLastAiMove] = useState(null); // Store AI move separately
  const [isWaiting, setIsWaiting] = useState(false); // Prevent fast user moves

  useEffect(() => {
    axios
      .get("http://localhost:5555/board")
      .then((res) => setFen(res.data.fen))
      .catch((err) => console.error("Error fetching board:", err));
  }, []);

  const onDrop = async (sourceSquare, targetSquare) => {
    if (isWaiting) return; // Block moves during AI response

    try {
      // User makes a move
      const res = await axios.post("http://localhost:5555/move", {
        move: { from: sourceSquare, to: targetSquare },
      });

      setFen(res.data.fen);

      // Store AI move separately for smooth transition
      setIsWaiting(true);
      setTimeout(() => {
        axios.get("http://localhost:5555/last-move").then((aiMoveRes) => {
          setLastAiMove(aiMoveRes.data.move); // Store AI move
          setFen(aiMoveRes.data.fen); // Update board
          setIsWaiting(false);
        });
      }, 500); // Delay AI move animation by 500ms
    } catch (err) {
      console.log("Invalid move:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Chess Game</h1>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardWidth={400}
        animationDuration={500} // Enables smooth animation
        customArrows={lastAiMove ? [[lastAiMove.from, lastAiMove.to]] : []} // Show AI move visually
      />
    </div>
  );
};

export default App;
