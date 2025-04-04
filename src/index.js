import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <React.Suspense fallback="Loading...">
          <App />
        </React.Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
