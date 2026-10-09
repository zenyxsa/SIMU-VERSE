import { useState, useEffect } from 'react';
import { Settings, Sparkles, MessageSquare, Plus } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import ScenarioCreator from './components/ScenarioCreator';
import ScenarioPlayer from './components/ScenarioPlayer';
import './index.css'; // Make sure styles are imported, removing App.css

function App() {
  const [currentView, setCurrentView] = useState('creator'); // 'creator', 'player'
  const [showSettings, setShowSettings] = useState(false);
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('simu_apikey') || '');
  const [apiModel, setApiModel] = useState(() => {
    const saved = localStorage.getItem('simu_apimodel');
    const validModels = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];
    return validModels.includes(saved) ? saved : 'openai/gpt-oss-20b';
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('simu_theme') || 'dark');
  const [activeScenario, setActiveScenario] = useState(null);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Handlers
  const handleStartScenario = (scenarioData) => {
    setActiveScenario(scenarioData);
    setCurrentView('player');
  };

  const handleEndScenario = () => {
    setActiveScenario(null);
    setCurrentView('creator');
  };

  const handleSaveSettings = (key, model, newTheme) => {
    setApiKey(key);
    setApiModel(model);
    setTheme(newTheme);
    localStorage.setItem('simu_apikey', key);
    localStorage.setItem('simu_apimodel', model);
    localStorage.setItem('simu_theme', newTheme);
    setShowSettings(false);
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <div className="logo-container clickable" onClick={() => { if(currentView !== 'player') setCurrentView('creator'); }} style={{cursor: 'pointer'}}>
          <div className="logo-icon">
            <Sparkles size={20} color="white" />
          </div>
          <h2>SimuVerse</h2>
        </div>
        
        <div className="header-actions">
           {currentView === 'player' && (
             <button className="btn-secondary" onClick={handleEndScenario} style={{ marginRight: '12px' }}>
                <Plus size={16} /> New Scenario
             </button>
           )}
           <button 
             className="btn-icon" 
             onClick={() => setShowSettings(true)}
             title="Settings"
           >
             <Settings size={24} />
           </button>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'creator' && (
          <ScenarioCreator onStart={handleStartScenario} apiKey={apiKey} onOpenSettings={() => setShowSettings(true)} />
        )}
        
        {currentView === 'player' && activeScenario && (
          <ScenarioPlayer scenario={activeScenario} apiKey={apiKey} apiModel={apiModel} />
        )}
      </main>

      {showSettings && (
        <SettingsPanel 
          apiKey={apiKey}
          apiModel={apiModel}
          theme={theme}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
