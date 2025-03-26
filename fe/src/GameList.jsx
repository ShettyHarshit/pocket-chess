import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import ChessHero from "./custom-components/ChessHero";

export default function GameList() {
  const { isSignedIn, user } = useUser();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNewGame = async () => {
    const response = await fetch("http://localhost:5555/create-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.success) {
      setGames((prevGames) => [...prevGames, data.game]);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5555/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {!isSignedIn ? (
          <ChessHero />
        ) : (
          <div className="mx-auto max-w-3xl p-6 bg-white rounded-lg shadow-md border">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
              Chess Games
            </h1>

            <div className="flex justify-center mb-6">
              <Button
                variant="default"
                onClick={handleNewGame}
                className="px-6 py-2"
              >
                ➕ Start New Game
              </Button>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center">♟️ Loading games...</p>
            ) : games.length === 0 ? (
              <p className="text-gray-500 text-center">
                No games available. Start a new game!
              </p>
            ) : (
              <ul className="space-y-3">
                {games.map((game) => (
                  <li
                    key={game.id}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition"
                  >
                    <Link
                      to={`/game/${game.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      ♜ Game #{game.id} –{" "}
                      <span className="text-gray-700">{game.fen}</span>
                    </Link>
                    <Button variant="outline" className="text-sm">
                      Join
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
