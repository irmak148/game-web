import { useState } from 'react';

function Games() {
  const [games] = useState([
    {
      id: 1,
      title: 'Agar.io',
      category: 'Çok Oyunculu',
      rating: 4.5,
      players: 1500
    },
    {
      id: 2,
      title: '2048',
      category: 'Bulmaca',
      rating: 4.8,
      players: 2000
    },
    {
      id: 3,
      title: 'Tetris',
      category: 'Klasik',
      rating: 4.9,
      players: 1800
    },
    {
      id: 4,
      title: 'Slither.io',
      category: 'Çok Oyunculu',
      rating: 4.6,
      players: 2500
    }
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tüm Oyunlar</h1>
      
      <div className="flex flex-col space-y-4">
        {games.map(game => (
          <div key={game.id} className="bg-dark p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <p className="text-gray-400">{game.category}</p>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-yellow-400 text-lg">{game.rating}</p>
                <p className="text-sm text-gray-400">Puan</p>
              </div>
              
              <div className="text-center">
                <p className="text-green-400 text-lg">{game.players}</p>
                <p className="text-sm text-gray-400">Aktif Oyuncu</p>
              </div>
              
              <button className="btn btn-primary">
                Oyna
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;
