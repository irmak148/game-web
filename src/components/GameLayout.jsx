import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GameLayout = ({ children, onPause, isPaused, score }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle fullscreen changes
  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.getElementById('game-container').requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/');
  };

  return (
    <div id="game-container" className="relative h-full flex">
      {/* Side Game Controls */}
      <div className="w-16 md:w-20 bg-gray-800 border-r border-gray-700 z-40 flex flex-col items-center justify-between py-4">
        {/* Score at top */}
        <div className="text-white text-center">
          <div className="mb-1 text-xs text-gray-400">Score</div>
          <div className="font-bold">{score}</div>
        </div>

        {/* Controls at bottom */}
        <div className="flex flex-col space-y-6">
          {onPause && (
            <button
              onClick={() => onPause(!isPaused)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V10a1 1 0 11-2 0V5a1 1 0 011-1zm10 0a1 1 0 011 1v5a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H10a1 1 0 110-2h5zm-15 10a1 1 0 011-1h5a1 1 0 110 2h-3.586l2.293 2.293a1 1 0 11-1.414 1.414L5 16.414V20a1 1 0 11-2 0v-5a1 1 0 011-1zm15 0a1 1 0 011 1v5a1 1 0 11-2 0v-3.586l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 15H10a1 1 0 110-2h5z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H4a1 1 0 01-1-1zm12 0a1 1 0 011 1v4a1 1 0 11-2 0V4a1 1 0 011-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm12 0a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={handleExit}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Exit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="game-content flex-1 h-full">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
