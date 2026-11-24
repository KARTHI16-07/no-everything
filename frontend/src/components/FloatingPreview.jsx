import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, Circle, Flame, Target, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function FloatingPreview() {
  const [timerRunning, setTimerRunning] = useState(false);
  const [habits, setHabits] = useState([
    { id: 1, title: 'Deep Work Block 01', done: true, tag: 'FOCUS' },
    { id: 2, title: 'NQT Algorithmic Drill', done: true, tag: 'CODE' },
    { id: 3, title: 'Evening Philosophical Review', done: false, tag: 'MIND' },
  ]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  return (
    <div
      className="editorial-card p-4 shadow-2xl position-relative"
      style={{
        background: 'rgba(14, 14, 14, 0.95)',
        border: '1px solid var(--border-color)',
        borderRadius: '3px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        maxWidth: '480px',
        width: '100%',
      }}
    >
      {/* Top Telemetry Header */}
      <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: '8px', height: '8px', background: '#FFFFFF', borderRadius: '50%' }} className="pulse-dot" />
          <span className="editorial-label">STATION 01 // LIVE TELEMETRY</span>
        </div>
        <span className="editorial-badge">READY : 94%</span>
      </div>

      {/* Hero Widget: Mini Focus Timer */}
      <div className="editorial-card p-3 mb-3" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="editorial-label mb-1">CURRENT SPRINT</div>
            <div className="font-mono fs-4 fw-bold text-light">24:45</div>
            <div className="editorial-label" style={{ color: 'var(--text-muted)' }}>DEEP SYSTEM ARCHITECTURE</div>
          </div>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="editorial-btn editorial-btn-outline p-2"
            style={{ width: '42px', height: '42px' }}
          >
            {timerRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {/* KPI Trio */}
      <div className="row g-2 mb-3">
        <div className="col-4">
          <div className="p-2 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <div className="editorial-label">STREAK</div>
            <div className="font-mono fs-5 fw-bold d-flex align-items-center gap-1 text-light">
              <Flame size={14} /> 14D
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="p-2 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <div className="editorial-label">FOCUS</div>
            <div className="font-mono fs-5 fw-bold d-flex align-items-center gap-1 text-light">
              <Clock size={14} /> 125M
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="p-2 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <div className="editorial-label">SCORE</div>
            <div className="font-mono fs-5 fw-bold d-flex align-items-center gap-1 text-light">
              <ShieldCheck size={14} /> 98%
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Habit Micro-Check */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="editorial-label">DAILY INVARIANTS</span>
          <span className="editorial-label" style={{ color: 'var(--text-secondary)' }}>{habits.filter(h => h.done).length}/{habits.length} COMPLETED</span>
        </div>
        <div className="d-flex flex-column gap-2">
          {habits.map(h => (
            <div
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className="d-flex align-items-center justify-content-between p-2 border transition-smooth cursor-pointer"
              style={{
                borderColor: h.done ? 'var(--border-color)' : 'var(--border-subtle)',
                background: h.done ? 'var(--bg-tertiary)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                {h.done ? <CheckCircle2 size={15} className="text-light" /> : <Circle size={15} className="text-muted" />}
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.78rem',
                    color: h.done ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: h.done ? 'line-through' : 'none',
                  }}
                >
                  {h.title}
                </span>
              </div>
              <span className="editorial-badge" style={{ fontSize: '0.62rem' }}>{h.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
