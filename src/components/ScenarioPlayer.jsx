import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const generateResponse = async (history, premise, apiKey, apiModel) => {
  if (!apiKey) {
    return {
      role: 'system',
      content: 'Error: API Key is missing. Please configure your settings.'
    };
  }

  const systemInstruction = `You are an AI Scenario Simulator. The user is playing a text-based roleplaying game. 
Premise: ${premise}
Narrate the scenario based on the user's input. Progress the story logically, keep it engaging, vivid, but concise (1-2 paragraphs). Do not break character. Do not remark on being an AI. Stay strictly in the world of the scenario. End each response by presenting the outcome and waiting for the user's next action.`;

  // Map our history for Groq's OpenAI API format
  const apiMessages = [
    { role: 'system', content: systemInstruction },
    ...history.filter(m => m.role !== 'system').map(m => ({
      role: m.role,
      content: m.content
    }))
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: apiModel,
        messages: apiMessages
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API Error:", data);
      return { 
        role: 'system', 
        content: `API Error: ${data.error?.message || 'Failed to generate response.'}` 
      };
    }

    const modelReply = data.choices[0].message.content;
    return { role: 'assistant', content: modelReply };
  } catch (err) {
    console.error("Request failed:", err);
    return { role: 'system', content: 'Network Error: Could not connect to Groq API.' };
  }
};

const ScenarioPlayer = ({ scenario, apiKey, apiModel }) => {
  const [messages, setMessages] = useState([
    { role: 'system', content: `Welcome to the simulation, ${scenario.character}.\n\nPremise: ${scenario.premise}` },
    { role: 'system', content: "You stand at the beginning of your journey. What is your first move?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Call API (mocked)
    const response = await generateResponse([...messages, userMessage], scenario.premise, apiKey, apiModel);
    
    setMessages(prev => [...prev, response]);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div className="glass-panel" style={styles.chatBox}>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              ...styles.messageWrapper,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={msg.role === 'user' ? styles.userMessage : styles.systemMessage}>
                {msg.content.split('\n').map((para, i) => (
                  <p key={i} style={{marginBottom: i !== msg.content.split('\n').length -1 ? '8px' : 0}}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{...styles.messageWrapper, justifyContent: 'flex-start'}}>
               <div style={styles.typingIndicator}>
                 <Loader2 size={18} className="spin" /> Updating simulation...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <form onSubmit={handleSend} style={styles.form}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Describe your action..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.chatInput}
              disabled={loading}
              autoFocus
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!input.trim() || loading}
              style={{padding: '12px', minWidth: '48px'}}
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>

      <style jsx="true">{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: 'calc(100vh - 120px)'
  },
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  systemMessage: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    padding: '16px 20px',
    borderRadius: '16px',
    borderTopLeftRadius: '4px',
    maxWidth: '80%',
    color: 'var(--text-primary)',
    lineHeight: 1.6,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  userMessage: {
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    padding: '14px 20px',
    borderRadius: '16px',
    borderTopRightRadius: '4px',
    maxWidth: '80%',
    color: 'white',
    lineHeight: 1.6,
    boxShadow: '0 4px 15px var(--accent-glow)'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '8px 4px'
  },
  inputArea: {
    padding: '20px',
    borderTop: '1px solid var(--border-color)',
    background: 'rgba(0,0,0,0.2)'
  },
  form: {
    display: 'flex',
    gap: '12px'
  },
  chatInput: {
    borderRadius: '24px',
    padding: '14px 20px'
  }
};

export default ScenarioPlayer;
