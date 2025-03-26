import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GameList from "./GameList";
import React from "react";
import GamePage from "./GamePage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const { isSignedIn, user } = useUser();
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Pocket Chess
            </Link>
            <div>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">
                    {user.fullName || user.emailAddresses[0].emailAddress}
                  </span>
                  <SignOutButton>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                      Logout
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/game/:id"
            element={
              <SignedIn>
                <GamePage />
              </SignedIn>
            }
          />
          <Route
            path="*"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
