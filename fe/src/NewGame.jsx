import { useState } from "react";

export default function NewGameButton({ onGameCreated }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleNewGame = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5555/create-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        alert(`New game created with ID: ${data.game.id}`);
        onGameCreated(data.game); // Callback to update UI if needed
      } else {
        alert("Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleNewGame} disabled={isLoading}>
      {isLoading ? "Creating..." : "New Game"}
    </button>
  );
}
