import { useState } from 'react';

function Profile() {
  const [user] = useState({
    username: 'Oyuncu123',
    level: 15,
    points: 2500,
    achievements: [
      { id: 1, name: 'İlk Zafer', icon: '🏆' },
      { id: 2, name: 'Bulmaca Ustası', icon: '🧩' },
      { id: 3, name: 'Sosyal Kelebek', icon: '🦋' }
    ],
    recentGames: [
      { id: 1, name: '2048', playTime: '2 saat', score: 15000 },
      { id: 2, name: 'Tetris', playTime: '1 saat', score: 12000 },
      { id: 3, name: 'Agar.io', playTime: '30 dakika', score: 8000 }
    ]
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-2xl">
            {user.username[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-400">Seviye {user.level}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400">Toplam Puan</p>
            <p className="text-2xl font-bold">{user.points}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400">Başarımlar</p>
            <p className="text-2xl font-bold">{user.achievements.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Başarımlar</h2>
          <div className="space-y-4">
            {user.achievements.map(achievement => (
              <div key={achievement.id} className="bg-dark p-4 rounded-lg flex items-center space-x-4">
                <span className="text-2xl">{achievement.icon}</span>
                <span>{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Son Oyunlar</h2>
          <div className="space-y-4">
            {user.recentGames.map(game => (
              <div key={game.id} className="bg-dark p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{game.name}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Oynama Süresi: {game.playTime}</span>
                  <span>Skor: {game.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
