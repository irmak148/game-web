import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  const { gameScores, recentGames } = useGame();
  const { t } = useTranslation();
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set initial nickname from user displayName
  useEffect(() => {
    if (currentUser?.displayName) {
      setNickname(currentUser.displayName);
    } else if (currentUser?.email) {
      setNickname(currentUser.email.split('@')[0]);
    } else {
      setNickname(t('Oyuncu123'));
    }
  }, [currentUser, t]);

  // Calculate total score and achievements
  useEffect(() => {
    // Calculate total score from all games
    const total = Object.values(gameScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);

    // Calculate achievements
    const achievementsList = [];
    
    // First Victory Achievement
    if (total > 0) {
      achievementsList.push({ id: 1, name: t('İlk Zafer'), icon: '🏆' });
    }
    
    // Puzzle Master Achievement
    if (gameScores['2048'] && gameScores['2048'] >= 10000) {
      achievementsList.push({ id: 2, name: t('Bulmaca Ustası'), icon: '🎮' });
    }
    
    // Social Butterfly Achievement
    if (recentGames.length >= 3) {
      achievementsList.push({ id: 3, name: t('Sosyal Kelebek'), icon: '🦋' });
    }

    setAchievements(achievementsList);
  }, [gameScores, recentGames, t]);

  // Handle nickname update
  const handleNicknameUpdate = async () => {
    if (!nickname.trim()) {
      setError(t('Kullanıcı adı boş olamaz'));
      return;
    }

    if (nickname.length > 20) {
      setError(t('Kullanıcı adı 20 karakterden uzun olamaz'));
      return;
    }

    setError('');
    
    try {
      await updateUserProfile(currentUser, { displayName: nickname.trim() });
      setIsEditingNickname(false);
      setSuccess(t('Kullanıcı adı başarıyla güncellendi'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('Kullanıcı adı güncellenemedi') + ': ' + err.message);
    }
  };

  // Format play time
  const getTimeSincePlay = (timestamp) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} ${t('dakika')}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${t('saat')}`;
    return `${Math.floor(hours / 24)} ${t('gün')}`;
  };

  const formatGameId = (id) => {
    if (!id) return 'Unknown';
    // Capitalize first letter
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      {/* Profile Header */}
      <div className="bg-[#1f2937] rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-[#4f46e5] rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {nickname?.[0]?.toUpperCase() || 'O'}
          </div>
          
          <div className="flex-grow">
            {isEditingNickname ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-[#374151] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={t('Kullanıcı adı girin')}
                  maxLength={20}
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleNicknameUpdate}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    {t('Kaydet')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingNickname(false);
                      if (currentUser?.displayName) {
                        setNickname(currentUser.displayName);
                      } else if (currentUser?.email) {
                        setNickname(currentUser.email.split('@')[0]);
                      }
                      setError('');
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                  >
                    {t('İptal')}
                  </button>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white mr-2">
                    {nickname}
                  </h1>
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="text-gray-400 hover:text-white"
                    title={t('Kullanıcı adını düzenle')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-400">{t('Seviye')} {Math.floor(totalScore / 1000) + 1}</p>
                {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">{t('Toplam Puan')}</p>
            <p className="text-2xl font-bold text-white">{totalScore}</p>
          </div>
          <div className="bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">{t('Başarımlar')}</p>
            <p className="text-2xl font-bold text-white">{achievements.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Achievements Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">{t('Başarımlar')}</h2>
          <div className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className="bg-[#1f2937] p-4 rounded-lg flex items-center space-x-4 shadow-md hover:bg-[#2d3748] transition-colors"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-white">{achievement.name}</span>
                </div>
              ))
            ) : (
              <div className="bg-[#1f2937] p-4 rounded-lg text-center text-gray-400">
                {t('Henüz başarım kazanmadınız')}
              </div>
            )}
          </div>
        </div>

        {/* Recent Games Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">{t('Son Oyunlar')}</h2>
          <div className="space-y-4">
            {recentGames && recentGames.length > 0 ? (
              recentGames.map(game => (
                <div 
                  key={game.id + game.timestamp} 
                  className="bg-[#1f2937] p-4 rounded-lg shadow-md hover:bg-[#2d3748] transition-colors"
                >
                  <h3 className="font-semibold mb-2 text-white">{formatGameId(game.id)}</h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{t('Oynama Süresi')}: {getTimeSincePlay(game.timestamp)}</span>
                    <span>{t('Skor')}: {gameScores[game.id] || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1f2937] p-4 rounded-lg text-center text-gray-400">
                {t('Henüz oyun oynamadınız')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

