import { useState } from 'react';
import { Rocket, Wand2, User } from 'lucide-react';

const SUGGESTIONS = [
  "You are a detective in a cyberpunk city investigating a missing AI.",
  "You are the captain of a spaceship forced to land on an unknown planet.",
  "You wake up in a fantasy tavern with no memory, clutching a glowing crystal."
];

const ScenarioCreator = ({ onStart, apiKey, onOpenSettings }) => {
  const [prompt, setPrompt] = useState('');
  const [characterName, setCharacterName] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Pass raw data to App
    onStart({
      premise: prompt,
      character: characterName || 'Traveler',
      history: [
        { role: 'system', content: `Starting Scenario: ${prompt}` }
      ]
    });
  };

  return (
    <div className="animate-fade-in delay-100" style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={{fontSize: '3rem', marginBottom: '16px', lineHeight: 1.2}}>
          Create Your <br /> Own Reality
        </h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px'}}>
          Define a premise, step into the simulation, and see where the story takes you.
        </p>
      </div>

      <div className="glass-panel" style={styles.formContainer}>
        {!apiKey && (
          <div style={styles.warningBox}>
            <p>API Key required to generate scenarios.</p>
            <button className="btn-secondary" style={{padding: '6px 12px', fontSize: '0.85rem'}} onClick={onOpenSettings}>
              Configure
            </button>
          </div>
        )}

        <form onSubmit={handleStart} style={styles.form}>
          <div style={styles.inputGroup}>
             <label style={styles.label}><User size={16} /> Character Name (Optional)</label>
             <input 
               type="text" 
               className="input-field" 
               placeholder="Enter your name or alias" 
               value={characterName}
               onChange={(e) => setCharacterName(e.target.value)}
             />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Wand2 size={16} /> Scenario Premise</label>
            <textarea 
              className="input-field" 
              style={{minHeight: '120px', resize: 'vertical'}}
              placeholder="Describe the world, your role, and the starting situation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div style={styles.suggestions}>
             <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Quick Start:</span>
             <div style={styles.pillContainer}>
                {SUGGESTIONS.map((text, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    style={styles.pill}
                    onClick={() => setPrompt(text)}
                  >
                    {text}
                  </button>
                ))}
             </div>
          </div>

          <button 
             type="submit" 
             className="btn-primary" 
             style={{marginTop: '16px', height: '54px', fontSize: '1.1rem'}}
             disabled={!prompt.trim() || !apiKey}
          >
            <Rocket size={20} /> Initialize Simulation
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    marginTop: '40px'
  },
  heroSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    maxWidth: '650px',
    padding: '32px'
  },
  warningBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '0.95rem'
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  pillContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  pill: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  }
};

export default ScenarioCreator;
