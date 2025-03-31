const API_URL = import.meta.env.VITE_BE_API_URL;

export const fetchGames = async () => {
  const res = await fetch(`${API_URL}/games`);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
};

export const createNewGame = async () => {
  const res = await fetch(`${API_URL}/create-game`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create game");
  return res.json();
};
