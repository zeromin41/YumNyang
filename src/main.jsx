import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import Router from './routes/index.jsx'; 
import SplashScreen from './components/SplashScreen';

function AppInitializer() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppInitializer />
  </StrictMode>
);