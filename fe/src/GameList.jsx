import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/games")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

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

  return (
    <div>
      <h1>Chess Games</h1>
      <button onClick={handleNewGame}>New Game</button>

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`}>
              Game #{game.id} - {game.fen}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
