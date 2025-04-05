import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';
import Games from './pages/Games';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AgarGame from './pages/games/AgarGame';
import Game2048 from './pages/games/Game2048';
import TetrisGame from './pages/games/TetrisGame';
import GameRoute from './components/GameRoute';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/games/agar" element={<AgarGame />} />
        <Route path="/games/2048" element={<Game2048 />} />
        <Route path="/games/tetris" element={<TetrisGame />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 text-white">
              <Navbar />
              <PageLayout>
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Routes>
                </main>
              </PageLayout>
            </div>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
