import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Create user with email and password
      const { user } = await signup(email, password);
      
      // Update profile with nickname
      await updateUserProfile(user, {
        displayName: nickname || email.split('@')[0]
      });

      navigate('/');
    } catch (err) {
      setError(t('Failed to create an account'));
      console.error('Signup error:', err);
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {t('Create your account')}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-1">
                {t('Nickname')}
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('Enter your nickname')}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1">
                {t('Email address')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('Enter your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                {t('Password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? t('Creating account...') : t('Sign up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
