import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Games() {
  const { t } = useTranslation();
  const [games] = useState([
    {
      id: 'agar',
      title: 'Agar.io',
      category: t('Multiplayer'),
      rating: 4.5,
      players: 1500,
      path: '/games/agar'
    },
    {
      id: '2048',
      title: '2048',
      category: t('Puzzle'),
      rating: 4.8,
      players: 2000,
      path: '/games/2048'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      category: t('Classic'),
      rating: 4.9,
      players: 1800,
      path: '/games/tetris'
    },
    {
      id: 'slither',
      title: 'Slither.io',
      category: t('Multiplayer'),
      rating: 4.6,
      players: 2500,
      path: '/games/slither'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">{t('All Games')}</h1>
      
      <div className="grid gap-4">
        {games.map(game => (
          <div key={game.id} className="bg-[#1f2937] p-6 rounded-lg shadow-lg flex items-center justify-between hover:bg-[#2d3748] transition-colors">
            <div>
              <h3 className="text-xl font-semibold text-white">{game.title}</h3>
              <p className="text-gray-400">{game.category}</p>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-yellow-400 text-lg">{game.rating}</p>
                <p className="text-sm text-gray-400">{t('Rating')}</p>
              </div>
              
              <div className="text-center">
                <p className="text-green-400 text-lg">{game.players}</p>
                <p className="text-sm text-gray-400">{t('Active Players')}</p>
              </div>
              
              <Link 
                to={game.path}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {t('Play')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;
