import { useState } from 'react';

function Categories() {
  const [categories] = useState([
    {
      id: 1,
      name: 'Aksiyon',
      icon: '🎮',
      gameCount: 25
    },
    {
      id: 2,
      name: 'Bulmaca',
      icon: '🧩',
      gameCount: 30
    },
    {
      id: 3,
      name: 'Strateji',
      icon: '🎯',
      gameCount: 20
    },
    {
      id: 4,
      name: 'Çok Oyunculu',
      icon: '👥',
      gameCount: 15
    },
    {
      id: 5,
      name: 'Çocuk Oyunları',
      icon: '🎪',
      gameCount: 40
    }
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Oyun Kategorileri</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="bg-dark p-6 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-400">{category.gameCount} Oyun</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
