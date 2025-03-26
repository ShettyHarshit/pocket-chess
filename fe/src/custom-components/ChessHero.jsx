import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import ChessBoardIllustration from "./ChessBoardIllustration";

function ChessHero(props) {
  return (
    <div>
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pocket Chess: Play Anywhere
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Enjoy quick chess matches on the go! Play against AI or challenge
              friends online. Track your progress and improve your skills
              anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/play/single-player">
                <Button size="lg" variant="outline">
                  Play Now
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="default">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <ChessBoardIllustration />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChessHero;
