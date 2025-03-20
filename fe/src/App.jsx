import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GameList from "./GameList";
import GamePage from "./GamePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </Router>
  );
}
