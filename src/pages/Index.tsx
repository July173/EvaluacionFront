
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Login/RegisterForm';


const getViewFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') || 'login';
};

const Index = () => {
  const [currentView, setCurrentView] = useState(getViewFromUrl());

  useEffect(() => {
    const onPopState = () => {
      setCurrentView(getViewFromUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onNavigate={setCurrentView} />;
      case 'register':
        return <RegisterForm onNavigate={setCurrentView} />;
      default:
        return <LoginForm onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="sena-container">
      {renderForm()}
      <WelcomePanel />
    </div>
  );
};

export default Index;