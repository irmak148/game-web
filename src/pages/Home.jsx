import { useState } from 'react';

function Home() {
  const [featuredGames] = useState([
    {
      id: 1,
      title: 'Agar.io',
      image: '/games/agario.jpg',
      category: 'Çok Oyunculu'
    },
    {
      id: 2,
      title: '2048',
      image: '/games/2048.jpg',
      category: 'Bulmaca'
    },
    {
      id: 3,
      title: 'Tetris',
      image: '/games/tetris.jpg',
      category: 'Klasik'
    }
  ]);

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Tarayıcınızda Hemen Oynayın
        </h1>
        <p className="text-gray-400 mb-8">
          Yüzlerce ücretsiz oyun, hiçbir indirme gerekmez!
        </p>
        <button className="btn btn-primary text-lg">
          Rastgele Bir Oyun Seç
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Popüler Oyunlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map(game => (
            <div key={game.id} className="bg-dark rounded-lg overflow-hidden shadow-lg">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <span className="text-sm text-gray-400">{game.category}</span>
                <button className="btn btn-primary w-full mt-4">
                  Hemen Oyna
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
