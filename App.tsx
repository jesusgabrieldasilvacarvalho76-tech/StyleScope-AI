
import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { UploadScreen } from './components/UploadScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { getAnalysisForImages } from './services/geminiService';
import type { View, AnalysisRecord, AnalysisResult } from './types';
import { ArrowLeftIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [view, setView] = useState<View>('home');
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const storedHistory = localStorage.getItem('haircut-analysis-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('haircut-analysis-history');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      localStorage.setItem('haircut-analysis-history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history, isAuthenticated]);

  const handleAnalyze = async (frontalImage: string, sideImage: string) => {
    setView('analysis');
    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result: AnalysisResult = await getAnalysisForImages(frontalImage, sideImage);
      const newRecord: AnalysisRecord = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        frontalPhoto: frontalImage,
        sidePhoto: sideImage,
        result,
      };
      setHistory(prev => [newRecord, ...prev]);
      setCurrentAnalysis(newRecord);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistoryItem = (record: AnalysisRecord) => {
    setCurrentAnalysis(record);
    setView('analysis');
    setError(null);
    setIsLoading(false);
  };
  
  const handleClearHistory = () => {
    if(window.confirm("Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.")) {
      setHistory([]);
      setView('home');
    }
  };

  const handleLogin = (email: string, pass: string) => {
    // Simulação de login
    console.log("Login attempt:", email, pass);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleRegister = (name: string, email: string, pass: string) => {
    // Simulação de registro
    console.log("Register attempt:", name, email, pass);
    setUserEmail(email);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
      if (window.confirm("Tem certeza que deseja sair?")) {
        setIsAuthenticated(false);
        setUserEmail('');
        setView('home');
        setHistory([]);
      }
  };

  const renderView = () => {
    switch (view) {
      case 'upload':
        return <UploadScreen onAnalyze={handleAnalyze} />;
      case 'analysis':
        return <AnalysisScreen isLoading={isLoading} error={error} analysisRecord={currentAnalysis} />;
      case 'history':
        return <HistoryScreen history={history} onViewHistoryItem={handleViewHistoryItem} onClearHistory={handleClearHistory} />;
      case 'profile':
        return <ProfileScreen userEmail={userEmail} onLogout={handleLogout} />;
      case 'home':
      default:
        return <HomeScreen setView={setView} history={history} onViewHistoryItem={handleViewHistoryItem} />;
    }
  };
  
  const NavButton: React.FC<{
      onClick: () => void;
      label: string;
      isActive: boolean;
    }> = ({ onClick, label, isActive }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-full font-medium transition-colors text-sm md:px-6 ${
        isActive 
          ? 'bg-black text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`} 
      aria-label={label}
    >
        {label}
    </button>
  );

  if (!isAuthenticated) {
    if (authView === 'login') {
        return <LoginScreen onLogin={handleLogin} switchToRegister={() => setAuthView('register')} />;
    }
    return <RegistrationScreen onRegister={handleRegister} switchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-gray-200">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          <div className="w-10">
            {view !== 'home' && (
              <button onClick={() => setView('home')} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="font-bold text-lg tracking-tight">StyleScope AI</div>
          <div className="w-10 flex justify-end">
            <button onClick={() => setView('profile')} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Perfil">
                <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {renderView()}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="max-w-md mx-auto h-20 flex justify-around items-center px-4">
          <NavButton onClick={() => setView('home')} label="Início" isActive={view === 'home'} />
          <NavButton onClick={() => setView('history')} label="Histórico" isActive={view === 'history'} />
          <NavButton onClick={() => setView('profile')} label="Perfil" isActive={view === 'profile'} />
        </nav>
      </footer>
    </div>
  );
};

export default App;