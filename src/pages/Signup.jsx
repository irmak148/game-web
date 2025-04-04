import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError('Şifreler eşleşmiyor');
    }

    if (password.length < 6) {
      return setError('Şifre en az 6 karakter olmalıdır');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      
      // Başarılı kayıt sonrası kullanıcıyı ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Bu email adresi zaten kullanımda');
          break;
        case 'auth/invalid-email':
          setError('Geçersiz email adresi');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/şifre girişi aktif değil');
          break;
        case 'auth/weak-password':
          setError('Şifre çok zayıf');
          break;
        default:
          setError('Hesap oluşturulamadı: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold text-white">
              Yeni Hesap Oluşturun
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Hemen üye olun ve oyun macerasına başlayın!
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre Tekrar
                </label>
                <input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  required
                  disabled={loading}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:text-primary-dark transition duration-200">
                Zaten hesabınız var mı? Giriş yapın
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
