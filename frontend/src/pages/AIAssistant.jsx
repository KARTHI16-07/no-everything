import React, { useState, useEffect, useRef } from 'react';
import { aiApi } from '../services/api';
import {
  Send,
  Cpu,
  Trash2,
  Plus,
  Copy,
  Check,
  Bot,
  User as UserIcon,
  Sparkles,
  BookOpen,
  Code,
  ShieldAlert,
  Zap,
  Terminal,
  FileText
} from 'lucide-react';

export default function AIAssistant() {
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [activeMode, setActiveMode] = useState('LEARN');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const modes = [
    { key: 'LEARN', label: 'LEARN', icon: BookOpen, desc: 'Conceptual explanations & systems breakdown' },
    { key: 'PRACTICE', label: 'PRACTICE', icon: Code, desc: 'Interactive drills & technical problems' },
    { key: 'DOUBT', label: 'DOUBT', icon: Zap, desc: 'Instant code debugging & syntax clarifications' },
    { key: 'INTERVIEW', label: 'INTERVIEW', icon: Cpu, desc: 'Mock architectural & coding interviews' },
    { key: 'EXAM', label: 'EXAM', icon: Terminal, desc: 'NQT & competitive MCQ trap dissection' },
    { key: 'REVISION', label: 'REVISION', icon: FileText, desc: 'High-yield cheat-sheets & bullet summaries' },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConvId) {
      loadMessages(currentConvId);
    }
  }, [currentConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = () => {
    aiApi.getConversations()
      .then(res => {
        const list = res.data.data || [];
        setConversations(list);
        if (list.length > 0 && !currentConvId) {
          setCurrentConvId(list[0].id);
          setActiveMode(list[0].mode || 'LEARN');
        }
      })
      .catch(console.error);
  };

  const loadMessages = (id) => {
    aiApi.getMessages(id)
      .then(res => setMessages(res.data.data || []))
      .catch(console.error);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');
    setLoading(true);

    // Optimistically append user message
    setMessages(prev => [...prev, { role: 'user', content: userText, createdAt: new Date().toISOString() }]);

    aiApi.chat({
      conversationId: currentConvId,
      message: userText,
      mode: activeMode
    })
      .then(res => {
        const data = res.data.data;
        if (!currentConvId) {
          setCurrentConvId(data.conversationId);
          loadConversations();
        }
        setMessages(data.history || []);
      })
      .catch(err => {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Connection to AI reasoning engine interrupted. Please retry.', createdAt: new Date().toISOString() }
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleNewChat = () => {
    setCurrentConvId(null);
    setMessages([]);
  };

  const handleDeleteConversation = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this strategy session?')) {
      aiApi.deleteConversation(id).then(() => {
        if (currentConvId === id) {
          handleNewChat();
        }
        loadConversations();
      });
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-4" style={{ marginTop: '70px', minHeight: '90vh' }}>
      <div className="row g-4" style={{ height: 'calc(100vh - 120px)', minHeight: '620px' }}>
        {/* Left Sidebar: Conversations & Mode Selector */}
        <div className="col-lg-3 d-flex flex-column h-100">
          <div className="editorial-card p-3 mb-3 d-flex flex-column flex-grow-1 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="editorial-label">AI REASONING HUB</span>
              <button onClick={handleNewChat} className="editorial-btn editorial-btn-outline p-2 font-mono" style={{ fontSize: '0.72rem' }}>
                <Plus size={13} /> NEW SESSION
              </button>
            </div>

            {/* Mode Selector Badges */}
            <div className="mb-3">
              <span className="editorial-label mb-2 d-block">ACTIVE OPERATIONAL MODE</span>
              <div className="d-flex flex-column gap-1">
                {modes.map(m => {
                  const Icon = m.icon;
                  const isActive = activeMode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setActiveMode(m.key)}
                      className="btn text-start p-2 transition-smooth rounded-0 border d-flex align-items-center justify-content-between"
                      style={{
                        background: isActive ? 'var(--text-primary)' : 'transparent',
                        color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        borderColor: isActive ? 'var(--text-primary)' : 'var(--border-subtle)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Icon size={14} />
                        <span className="fw-bold">{m.label}</span>
                      </div>
                      <span style={{ fontSize: '0.62rem' }}>0{modes.indexOf(m) + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Past Conversations List */}
            <span className="editorial-label mb-2 d-block">SESSION ARCHIVES</span>
            <div className="flex-grow-1 overflow-auto d-flex flex-column gap-1 pe-1">
              {conversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => { setCurrentConvId(c.id); setActiveMode(c.mode); }}
                  className="p-2 border transition-smooth d-flex justify-content-between align-items-center cursor-pointer"
                  style={{
                    borderColor: currentConvId === c.id ? '#FFFFFF' : 'var(--border-subtle)',
                    background: currentConvId === c.id ? 'var(--bg-card)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="font-mono text-light text-truncate" style={{ fontSize: '0.78rem' }}>{c.title}</div>
                    <div className="editorial-label" style={{ fontSize: '0.62rem' }}>{c.mode} // {new Date(c.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="btn p-1 text-secondary hover-white"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="text-secondary font-mono text-center py-4" style={{ fontSize: '0.78rem' }}>
                  No sessions recorded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Chat Console */}
        <div className="col-lg-9 d-flex flex-column h-100">
          <div className="editorial-card p-0 d-flex flex-column h-100 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            {/* Console Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
              <div className="d-flex align-items-center gap-3">
                <Cpu size={18} className="text-light" />
                <div>
                  <div className="font-headline fw-bold text-light" style={{ fontSize: '0.95rem' }}>
                    GEMINI INTELLECT // {activeMode} PROTOCOL
                  </div>
                  <div className="editorial-label" style={{ fontSize: '0.65rem' }}>
                    {modes.find(m => m.key === activeMode)?.desc}
                  </div>
                </div>
              </div>
              <span className="editorial-badge">BACKEND PROXIED // SECURE</span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-4">
              {messages.length === 0 && (
                <div className="my-auto text-center font-mono py-5" style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <Cpu size={40} className="mb-3 text-light" />
                  <h3 className="font-headline fs-4 text-light">WHAT SYSTEM ARE WE ANALYZING?</h3>
                  <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                    Ask technical doubts, request Java/SQL code deconstructions, practice NQT problems, or conduct mock interviews in {activeMode} mode.
                  </p>
                </div>
              )}

              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant' || m.role === 'model';
                return (
                  <div
                    key={idx}
                    className={`d-flex gap-3 ${isAssistant ? 'justify-content-start' : 'justify-content-end'}`}
                  >
                    {isAssistant && (
                      <div
                        className="font-mono d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                      >
                        <Bot size={16} />
                      </div>
                    )}

                    <div
                      className="p-3 border font-mono position-relative"
                      style={{
                        maxWidth: '85%',
                        borderColor: isAssistant ? 'var(--border-color)' : 'var(--text-primary)',
                        background: isAssistant ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                        fontSize: '0.88rem',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {isAssistant && (
                        <button
                          onClick={() => copyToClipboard(m.content, idx)}
                          className="btn p-1 position-absolute top-0 end-0 m-2 text-secondary hover-white"
                          title="Copy message"
                        >
                          {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                      {m.content}
                    </div>

                    {!isAssistant && (
                      <div
                        className="font-mono d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '32px', height: '32px', border: '1px solid #FFFFFF', background: '#FFFFFF', color: '#050505' }}
                      >
                        <UserIcon size={16} />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="d-flex gap-3 justify-content-start">
                  <div
                    className="font-mono d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                  >
                    <Bot size={16} />
                  </div>
                  <div className="p-3 border font-mono text-secondary" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}>
                    <div className="spinner-border spinner-border-sm me-2 text-light" role="status"></div>
                    Synthesizing response in {activeMode} mode...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-top" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="editorial-input flex-grow-1"
                  placeholder={`Consult AI in ${activeMode} Mode (e.g. explain Spring Security filter chain)...`}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputPrompt.trim()}
                  className="editorial-btn editorial-btn-primary px-4"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
