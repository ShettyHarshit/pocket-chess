const express = require("express");
const cors = require("cors");
const { Chess } = require("chess.js");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const verifyDB = async () => {
  const result = await pool.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'games'
  `);

  if (!result.rows.length) {
    throw new Error(
      "❌ Database table 'games' does not exist. Please create it manually."
    );
  } else {
    console.log("✅ Database and table verified.");
  }
};

verifyDB().catch((err) => {
  console.error(err.message);
  process.exit(1); // Stop the server if DB check fails
});

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
