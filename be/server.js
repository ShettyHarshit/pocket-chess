const express = require("express");
const cors = require("cors");
const { Chess } = require("chess.js");

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());

let game = new Chess();

let lastAiMove = null;

// Get board state
app.get("/board", (req, res) => {
  res.json({ fen: game.fen() });
});

// Player move
app.post("/move", (req, res) => {
  const { move } = req.body;
  const result = game.move(move);
  console.log("🚀 ~ app.post ~ result:", result);

  if (!result) return res.status(400).json({ error: "Invalid move" });

  // Simple AI (Random Move)
  if (!game.isGameOver()) {
    const moves = game.moves();
    const aiMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(aiMove);
  }

  res.json({ fen: game.fen(), lastMove: game.history().slice(-1)[0] });
});

app.get("/last-move", (req, res) => {
  res.json({ move: lastAiMove, fen: game.fen() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
