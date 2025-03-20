import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";

export default function GameList() {
  const [games, setGames] = useState([]);

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

  const [loading, setLoading] = useState(true);

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
        <div className="relative py-16 md:py-24 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Pocket Chess: Play Anywhere
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Enjoy quick chess matches on the go! Play against AI or
                challenge friends online. Track your progress and improve your
                skills anytime, anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/play/single-player">
                  <Button size="lg" variant="outline">
                    Play Now
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] bg-muted rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#404040]/20 to-[#D9D9D9]/5 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isBlack = (row + col) % 2 === 1;
                      return (
                        <div
                          key={i}
                          className={`${
                            isBlack ? "bg-gray-700" : "bg-gray-200"
                          } border border-gray-400`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chess Games</h1>
        <Button variant="outline" onClick={handleNewGame} className="mb-4">
          New Game
        </Button>

        {loading ? (
          <p className="text-gray-500">Loading games...</p>
        ) : (
          <ul className="space-y-2">
            {games.map((game) => (
              <li
                key={game.id}
                className="border p-2 rounded hover:bg-gray-100"
              >
                <Link
                  to={`/game/${game.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Game #{game.id} - {game.fen}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
