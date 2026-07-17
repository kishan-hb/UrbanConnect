import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AIAssistantChatBox.css';

function AIAssistantChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your UrbanConnect AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: authState?.user ? { role: authState.role } : {},
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || 'Sorry, I couldn\'t process that.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I\'m having trouble connecting. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`ai-chatbox ${isOpen ? 'open' : ''}`}>
      <button className="ai-chatbox-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle AI assistant">
        {isOpen ? (
          <span className="material-icons">close</span>
        ) : (
          <span className="material-icons">smart_toy</span>
        )}
      </button>

      {isOpen && (
        <div className="ai-chatbox-panel">
          <div className="ai-chatbox-header">
            <span className="material-icons">smart_toy</span>
            <span>AI Assistant</span>
          </div>

          <div className="ai-chatbox-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chatbox-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <span className="material-icons">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AIAssistantChatBox;