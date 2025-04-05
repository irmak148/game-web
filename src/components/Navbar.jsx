import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { recentGames, searchQuery, setSearchQuery } = useGame();
  const navigate = useNavigate();
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const gamesMenuRef = useRef(null);

  // Get user's display name or fallback to email username
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    } else if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return t('Oyuncu123');
  };

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
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-[#1c1c1c] text-white h-14 fixed w-full top-0 z-50">
      <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between">
        {/* Left side - Logo and Mobile Menu Button */}
        <div className="flex items-center h-full">
          <button
            className="md:hidden mr-2 p-2 hover:bg-[#2a2a2a] rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <Link to="/" className="flex items-center space-x-2 h-full px-4 hover:bg-[#2a2a2a]">
            <img src="/game-icon.svg" alt="Game Icon" className="h-8 w-8 text-white" />
            <span className="text-xl font-bold hidden sm:block">{t('Web-Game')}</span>
          </Link>
        </div>

        {/* Center - Search Bar (Hidden on Mobile) */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('Find game or genre')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 bg-[#2a2a2a] rounded-full px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right side - Auth buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center h-full">
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="h-full flex items-center px-4 hover:bg-[#2a2a2a]"
              >
                {getUserDisplayName()}
              </Link>
              <button
                onClick={handleLogout}
                className="h-full px-4 hover:bg-[#2a2a2a]"
              >
                {t('Logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="h-full flex items-center px-4 hover:bg-[#2a2a2a]"
              >
                {t('Login')}
              </Link>
              <Link
                to="/signup"
                className="h-full flex items-center px-4 hover:bg-[#2a2a2a]"
              >
                {t('Sign Up')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-14 left-0 right-0 bg-[#1c1c1c] border-t border-[#2a2a2a] p-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('Find game or genre')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[#2a2a2a] rounded-full px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 hover:bg-[#2a2a2a] rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {getUserDisplayName()}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-[#2a2a2a] rounded-lg text-left"
                  >
                    {t('Logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-[#2a2a2a] rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('Login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 hover:bg-[#2a2a2a] rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('Sign Up')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
