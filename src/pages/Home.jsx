import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGame } from '../contexts/GameContext';

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { allGames, searchGames, searchQuery } = useGame();

  const filteredGames = searchGames(searchQuery);

  return (
    <div className="container mx-auto px-4 mt-20 space-y-12">
      {/* Featured Games */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-white">
          {searchQuery ? t('Search Results') : t('Games')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div 
              key={game.id} 
              className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer"
              onClick={() => navigate(game.path)}
            >
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-3">{t(game.description)}</p>
                <span className="inline-block bg-[#1c1c1c] text-sm text-gray-300 px-3 py-1 rounded-full">
                  {t(game.category)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {searchQuery && filteredGames.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {t('No games found matching your search')}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
