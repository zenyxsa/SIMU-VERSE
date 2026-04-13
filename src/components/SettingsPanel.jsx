import { useState } from 'react';
import { X, Key, ShieldAlert, Palette } from 'lucide-react';

const SettingsPanel = ({ apiKey, apiModel = 'llama-3.1-8b-instant', theme = 'dark', onSave, onClose }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState(apiModel);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(inputKey, selectedModel, selectedTheme);
  };

  return (
    <div className="settings-overlay animate-fade-in" style={styles.overlay}>
      <div className="glass-panel" style={styles.panel}>
        <div style={styles.header}>
          <h3>Settings</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <Key size={16} /> API Key (Groq)
            </label>
            <input 
              type="password" 
              className="input-field" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="gsk_..."
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <Key size={16} /> API Model
            </label>
            <select 
              className="input-field" 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{cursor: 'pointer'}}
            >
              <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
              <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
              <option value="llama-3.2-11b-text-preview">Llama 3.2 11B</option>
              <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <Palette size={16} /> Theme
            </label>
            <select 
              className="input-field" 
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{cursor: 'pointer'}}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div style={styles.infoBox}>
            <ShieldAlert size={18} style={{color: 'var(--accent-primary)', flexShrink: 0}} />
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
              Your API key is stored locally in your browser and used to interact with the simulated scenarios.
            </p>
          </div>

          <div style={styles.actions}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  panel: {
    width: '90%',
    maxWidth: '500px',
    padding: '24px',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)'
  },
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    padding: '12px',
    borderRadius: '8px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px'
  }
};

export default SettingsPanel;
