import React from 'react';
import { useLocation } from 'react-router-dom';

const PageLayout = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/games/');

  return (
    <div className={`min-h-screen ${isGamePage ? 'pt-14' : 'pt-20'}`}>
      {children}
    </div>
  );
};

export default PageLayout;
