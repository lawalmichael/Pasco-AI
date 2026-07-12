import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { askTutor } from '../api';
import BottomNav from '../components/BottomNav';
import './TutorScreen.css';

const SUGGESTIONS = [
  'Explain photosynthesis simply',
  'What is the quadratic formula?',
  'How does supply and demand work?',
  'Explain Newton\'s third law',
  'What causes rainfall?',
  'Summarise the Nigerian Civil War',
];

export default function TutorScreen() {
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    // Build history excluding the last user message (already in newMessages)
    const history = newMessages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await askTutor({ question: userMsg, conversation_history: history });
      const answer = res.answer ?? res.response ?? res.explanation ?? JSON.stringify(res);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I could not reach the server right now. Please check your connection and try again.',
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="tutor-root">
      {/* Header */}
      <div className="tutor-screen-header">
        <div className="tutor-screen-avatar">🤖</div>
        <div>
          <h2>AI Tutor</h2>
          <p>Ask me anything about your subjects</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {messages.length === 0 && (
          <div className="tutor-empty">
            <p className="tutor-empty-title">What do you need help with?</p>
            <p className="tutor-empty-sub">Ask a question or pick a suggestion below.</p>
            <div className="suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role} ${m.error ? 'error' : ''}`}>
            {m.role === 'assistant' && (
              <span className="bubble-avatar">🤖</span>
            )}
            <div className="bubble-content">
              {m.role === 'assistant'
                ? <ReactMarkdown>{m.content}</ReactMarkdown>
                : <p>{m.content}</p>
              }
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble assistant">
            <span className="bubble-avatar">🤖</span>
            <div className="bubble-content">
              <span className="typing-dots">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="tutor-input-bar">
        <textarea
          className="tutor-textarea"
          placeholder="Ask your tutor anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          className="tutor-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          ↑
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
