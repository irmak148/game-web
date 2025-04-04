import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameLayout = ({ children, onPause, isPaused, score }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  // Handle fullscreen changes
  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle mouse click for pause
  const handleMouseClick = (e) => {
    // Left click to pause
    if (e.button === 0) {
      onPause?.(!isPaused);
    }
  };

  React.useEffect(() => {
    const gameContent = document.querySelector('.game-content');
    if (gameContent) {
      gameContent.addEventListener('mousedown', handleMouseClick);
      return () => {
        gameContent.removeEventListener('mousedown', handleMouseClick);
      };
    }
  }, [isPaused, onPause]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 flex">
      {/* Side Menu */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
        <button
          onClick={() => onPause?.(!isPaused)}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title="Fullscreen"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </button>

        <button
          onClick={handleExit}
          className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          title="Exit"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Game Content */}
      <div className="flex-1 relative game-content">
        {/* Score Display */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          Score: {score}
        </div>

        {children}
      </div>
    </div>
  );
};

export default GameLayout;
