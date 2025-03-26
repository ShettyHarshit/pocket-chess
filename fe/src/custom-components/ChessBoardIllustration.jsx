import React, { useEffect, useState } from "react";

const getRandomStart = () => {
  return [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
};

const getRandomDirection = () => {
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
    [-1, -1], // Diagonal Up-Left
    [-1, 1], // Diagonal Up-Right
    [1, -1], // Diagonal Down-Left
    [1, 1], // Diagonal Down-Right
  ];
  return directions[Math.floor(Math.random() * directions.length)];
};

const ChessBoardIllustration = () => {
  const [highlightedSquares, setHighlightedSquares] = useState([]);
  const [position, setPosition] = useState(getRandomStart());

  useEffect(() => {
    const interval = setInterval(() => {
      let [row, col] = position;
      let [rowDir, colDir] = getRandomDirection();

      // Move in random direction
      row += rowDir;
      col += colDir;

      // Ensure within bounds (bounce if needed)
      if (row < 0) row = 0;
      if (row > 6) row = 6;
      if (col < 0) col = 0;
      if (col > 6) col = 6;

      setPosition([row, col]);

      setHighlightedSquares([
        row * 8 + col,
        row * 8 + (col + 1),
        (row + 1) * 8 + col,
        (row + 1) * 8 + (col + 1),
      ]);
    }, 250); // Speed of movement

    return () => clearInterval(interval);
  }, [position]);

  return (
    <div
      className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] 
      bg-muted rounded-lg overflow-hidden border-2 border-gray-300 
      shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isBlack = (row + col) % 2 === 1;
            const isHighlighted = highlightedSquares.includes(i);

            return (
              <div
                key={i}
                className={`relative w-full h-full border border-gray-400 
                  ${isBlack ? "bg-[#333]" : "bg-[#f5f5f5]"}

                  /* Metallic hover effect */
                  before:absolute before:inset-0 before:bg-gradient-to-br 
                  before:opacity-0 before:transition-all before:duration-[0.5s] before:ease-in-out
                  ${
                    isBlack
                      ? "before:from-gray-600 before:to-gray-900 hover:before:opacity-70 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "before:from-gray-300 before:to-white hover:before:opacity-80 hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]"
                  }

                  /* Highlight 2x2 spotlight */
                  ${
                    isHighlighted
                      ? isBlack
                        ? "before:opacity-90 before:blur-[5px] before:bg-blue-400 shadow-[0_0_50px_rgba(0,0,255,0.5)] transition-all duration-[1s] ease-in-out"
                        : "before:opacity-90 before:blur-[5px] before:bg-yellow-400 shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all duration-[1s] ease-in-out"
                      : "before:opacity-0 transition-all duration-[1s] ease-in-out"
                  }

                  
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChessBoardIllustration;
