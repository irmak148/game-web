import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

// Main navigation component
function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const { t } = useTranslation();
  const gamesMenuRef = useRef(null);

  // Close games menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (gamesMenuRef.current && !gamesMenuRef.current.contains(event.target)) {
        setIsGamesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle user logout
  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Logo and Games menu */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            {t('portal')}
          </Link>

          <div className="relative" ref={gamesMenuRef}>
            <button
              className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-700"
              onClick={() => setIsGamesOpen(!isGamesOpen)}
            >
              <span>{t('games')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isGamesOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <Link
                    to="/games/agar"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsGamesOpen(false)}
                  >
                    Agar.io
                  </Link>
                  <Link
                    to="/games/2048"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsGamesOpen(false)}
                  >
                    2048
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-gray-300">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
