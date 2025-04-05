import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { currentUser } = useAuth();
  const [recentGames, setRecentGames] = useState([]);
  const [gameScores, setGameScores] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialMount = useRef(true);

  // Load scores from localStorage when component mounts
  useEffect(() => {
    const storageKey = currentUser ? `scores_${currentUser.uid}` : 'scores_guest';
    const storedScores = localStorage.getItem(storageKey);
    if (storedScores) {
      setGameScores(JSON.parse(storedScores));
    }

    const storedGames = localStorage.getItem(currentUser ? `recent_${currentUser.uid}` : 'recent_guest');
    if (storedGames) {
      setRecentGames(JSON.parse(storedGames));
    }
  }, [currentUser]);

  // All available games
  const allGames = [
    {
      id: 'agar',
      title: 'Agar.io',
      description: 'Eat dots and grow bigger',
      category: 'Multiplayer',
      path: '/games/agar',
      image: '/games/agar/agar-thumbnail.svg'
    },
    {
      id: '2048',
      title: '2048',
      description: 'Merge tiles to reach 2048',
      category: 'Puzzle',
      path: '/games/2048',
      image: '/games/2048/2048-thumbnail.svg'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classic block stacking game',
      category: 'Classic',
      path: '/games/tetris',
      image: '/games/tetris/tetris-thumbnail.svg'
    }
  ];

  // Save score for a game
  const saveScore = useCallback((gameId, score) => {
    if (!gameId) return;
    
    setGameScores(prev => {
      const prevScore = prev[gameId] || 0;
      if (score <= prevScore) return prev;

      const newScores = {
        ...prev,
        [gameId]: score
      };
      
      // Save to localStorage
      const storageKey = currentUser ? `scores_${currentUser.uid}` : 'scores_guest';
      localStorage.setItem(storageKey, JSON.stringify(newScores));
      return newScores;
    });
  }, [currentUser]);

  // Add a game to recent games
  const addRecentGame = useCallback((gameId) => {
    if (!gameId || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    setRecentGames(prev => {
      // Check if game is already the most recent
      if (prev.length > 0 && prev[0]?.id === gameId) return prev;

      const newGames = [
        { id: gameId, timestamp: Date.now() },
        ...prev.filter(game => game.id !== gameId)
      ].slice(0, 10); // Keep only last 10 games
      
      // Save to localStorage
      const storageKey = currentUser ? `recent_${currentUser.uid}` : 'recent_guest';
      localStorage.setItem(storageKey, JSON.stringify(newGames));
      return newGames;
    });
  }, [currentUser]);

  // Search games by query
  const searchGames = useCallback((query) => {
    if (!query) return allGames;
    const lowercaseQuery = query.toLowerCase();
    return allGames.filter(game => 
      game.title.toLowerCase().includes(lowercaseQuery) ||
      game.category.toLowerCase().includes(lowercaseQuery) ||
      game.description.toLowerCase().includes(lowercaseQuery)
    );
  }, []);

  const value = {
    recentGames,
    gameScores,
    saveScore,
    addRecentGame,
    allGames,
    searchGames,
    searchQuery,
    setSearchQuery
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
