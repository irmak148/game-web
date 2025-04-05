import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

// GameRoute component that allows both authenticated and guest users
export default function GameRoute({ children }) {
  const { currentUser } = useAuth();
  const { addRecentGame } = useGame();
  const location = useLocation();
  
  // Extract the game ID from the current path
  const gameId = location.pathname.split('/').pop();
  
  // Add to recent games when accessing the route
  useEffect(() => {
    console.log("GameRoute loaded, game ID:", gameId);
    if (gameId) {
      addRecentGame(gameId);
    }
  }, [gameId, addRecentGame]);

  return children;
}
