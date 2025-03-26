const express = require("express");
const cors = require("cors");
const { Chess } = require("chess.js");
const { Pool } = require("pg");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
require("dotenv").config();

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());

const clerkAuth = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

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

// Create new game
app.post("/create-game", clerkAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
          INSERT INTO games (fen, moves) 
          VALUES ($1, $2) 
          RETURNING id, fen, created_at
      `,
      [new Chess().fen(), "[]"]
    );

    res.json({ success: true, game: rows[0] });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ success: false, error: "Failed to create game" });
  }
});

// List all games
app.get("/games", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM games ORDER BY created_at DESC"
  );
  res.json(rows);
});

// Get a specific game by ID
app.get("/game/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query("SELECT * FROM games WHERE id = $1", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(rows[0]);
});

// Player move
app.post("/move", async (req, res) => {
  try {
    const { gameId, move } = req.body;

    // Fetch the game from the database
    const { rows } = await pool.query("SELECT * FROM games WHERE id = $1", [
      gameId,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Game not found" });

    const game = new Chess(rows[0].fen);
    if (game.isGameOver()) {
      console.log("🚨 Game Over!");

      if (game.isDraw()) {
        console.log("🤝 It's a draw!");
      } else {
        const winner = game.turn() === "w" ? "Black" : "White";
        console.log(`🏆 Checkmate! ${winner} wins.`);
      }
    }

    let gameOverMessage = "";
    if (game.isGameOver()) {
      if (game.inCheckmate()) {
        const winner = game.turn() === "w" ? "Black" : "White";
        gameOverMessage = `🏆 Checkmate! ${winner} wins.`;
      } else if (game.isStalemate()) {
        gameOverMessage = "🤝 Stalemate! It's a draw.";
      } else if (game.isThreefoldRepetition()) {
        gameOverMessage = "🔁 Draw by threefold repetition.";
      } else if (game.isInsufficientMaterial()) {
        gameOverMessage = "⛔ Draw due to insufficient material.";
      } else if (game.isDraw()) {
        gameOverMessage = "🤝 It's a draw.";
      }
    }

    const isPawnReachingEnd =
      (move.to[1] === "8" && game.get(move.from)?.type === "p") || // White pawn promotion
      (move.to[1] === "1" && game.get(move.from)?.type === "p"); // Black pawn promotion

    const result = game.move({
      ...move,
      promotion: isPawnReachingEnd ? "q" : undefined, // Auto-promote to Queen
    });

    if (!result) {
      return res.status(400).json({ error: "Invalid move" }); // No crash here
    }

    // Simple AI (Random Move)
    if (!game.isGameOver()) {
      const moves = game.moves();
      const aiMove = moves[Math.floor(Math.random() * moves.length)];
      game.move(aiMove);
    }

    // Update the database with the new state
    await pool.query(
      `
          UPDATE games 
          SET fen = $1, moves = moves || $2 
          WHERE id = $3
      `,
      [game.fen(), JSON.stringify([move]), gameId]
    );

    res.json({
      fen: game.fen(),
      lastMove: game.history().slice(-1)[0],
      gameOver: game.isGameOver(),
      message: gameOverMessage || undefined,
    });
  } catch (error) {
    console.error("Error processing move:", error);
    res.status(500).json({ error: "Server error occurred." });
  }
});

app.get("/last-move", (req, res) => {
  res.json({ move: lastAiMove, fen: game.fen() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
