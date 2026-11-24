import React, { useState, useEffect, useRef } from 'react';
import { focusApi } from '../services/api';
import { soundManager } from '../utils/audio';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Award, Clock, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FocusTimer() {
  const [mode, setMode] = useState('POMODORO'); // 'POMODORO' (25), 'SHORT_BREAK' (5), 'LONG_BREAK' (15), 'CUSTOM'
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(50);
  const [ambientSound, setAmbientSound] = useState('NONE'); // 'NONE', 'GAMMA_40HZ', 'BROWN_NOISE'
  const [tag, setTag] = useState('DEEP_WORK');
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    loadFocusStats();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      soundManager.stopAmbient();
    };
  }, []);

  const loadFocusStats = () => {
    focusApi.getStats()
      .then(res => {
        if (res.data && res.data.data) {
          setStats(res.data.data);
          if (res.data.data.recentSessions) {
            setHistory(res.data.data.recentSessions);
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleModeChange = (newMode, minutes) => {
    setIsRunning(false);
    setMode(newMode);
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
  };

  const handleToggleTimer = () => {
    if (!isRunning) {
      soundManager.initContext();
      if (ambientSound !== 'NONE') {
        soundManager.startAmbient(ambientSound);
      }
    } else {
      soundManager.stopAmbient();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    soundManager.stopAmbient();
  };

  const handleAmbientChange = (type) => {
    setAmbientSound(type);
    if (isRunning) {
      if (type === 'NONE') {
        soundManager.stopAmbient();
      } else {
        soundManager.startAmbient(type);
      }
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    soundManager.stopAmbient();
    soundManager.playBell();

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    const completedMinutes = Math.round(totalSeconds / 60);

    setSaving(true);
    focusApi.recordSession({
      durationMinutes: completedMinutes,
      sessionType: mode,
      tag,
      notes: notes || `${mode} sprint completed.`
    })
      .then(() => {
        loadFocusStats();
        setTimeLeft(totalSeconds);
      })
      .finally(() => setSaving(false));
  };

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">COGNITIVE CHAMBER // ATTENTION CRUCIBLE</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            FOCUS LABORATORY
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            High-efficiency Pomodoro cycles backed by synthesized binaural frequencies and persistent audit logs.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <span className="editorial-badge">DAILY TARGET: {stats?.dailyGoalMinutes || 100} MINS</span>
          <span className="editorial-badge">PROGRESS: {Math.round(stats?.dailyGoalProgress || 0)}%</span>
        </div>
      </div>

      <div className="row g-5 align-items-center">
        {/* Left Column: Interactive Circular Timer */}
        <div className="col-lg-6 text-center">
          {/* Mode Switcher Tabs */}
          <div className="d-inline-flex border p-1 mb-5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <button
              onClick={() => handleModeChange('POMODORO', 25)}
              className="editorial-btn p-2"
              style={{
                background: mode === 'POMODORO' ? 'var(--text-primary)' : 'transparent',
                color: mode === 'POMODORO' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
              }}
            >
              FOCUS (25M)
            </button>
            <button
              onClick={() => handleModeChange('SHORT_BREAK', 5)}
              className="editorial-btn p-2"
              style={{
                background: mode === 'SHORT_BREAK' ? 'var(--text-primary)' : 'transparent',
                color: mode === 'SHORT_BREAK' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
              }}
            >
              SHORT BREAK (5M)
            </button>
            <button
              onClick={() => handleModeChange('LONG_BREAK', 15)}
              className="editorial-btn p-2"
              style={{
                background: mode === 'LONG_BREAK' ? 'var(--text-primary)' : 'transparent',
                color: mode === 'LONG_BREAK' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
              }}
            >
              LONG BREAK (15M)
            </button>
            <button
              onClick={() => handleModeChange('CUSTOM', customMinutes)}
              className="editorial-btn p-2"
              style={{
                background: mode === 'CUSTOM' ? 'var(--text-primary)' : 'transparent',
                color: mode === 'CUSTOM' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
              }}
            >
              CUSTOM ({customMinutes}M)
            </button>
          </div>

          {/* Giant Brutalist Timer Clock */}
          <div
            className="editorial-card mx-auto p-5 mb-5 d-flex flex-column align-items-center justify-content-center position-relative"
            style={{
              width: 'min(360px, 90vw)',
              height: 'min(360px, 90vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--bg-card) 60%, var(--bg-tertiary) 100%)',
              border: '2px solid var(--border-color)',
            }}
          >
            <div className="editorial-label mb-2" style={{ color: 'var(--text-muted)' }}>
              {mode} SPRINT
            </div>
            <div
              className="font-mono text-light fw-bold"
              style={{
                fontSize: 'clamp(3.8rem, 8vw, 5.2rem)',
                lineHeight: '1',
                letterSpacing: '-0.03em',
              }}
            >
              {timeFormatted}
            </div>
            <div className="editorial-label mt-2" style={{ color: 'var(--text-secondary)' }}>
              {tag} // {isRunning ? 'ACTIVE INVARIANT' : 'STANDBY'}
            </div>
          </div>

          {/* Controls */}
          <div className="d-flex justify-content-center align-items-center gap-3">
            <button
              onClick={handleToggleTimer}
              className="editorial-btn editorial-btn-primary py-3 px-5"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'HALT SPRINT' : 'IGNITE SPRINT'}</span>
            </button>
            <button
              onClick={handleReset}
              className="editorial-btn editorial-btn-outline py-3 px-4"
              title="Reset Timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Audio Generator & Focus Configurations */}
        <div className="col-lg-6">
          {/* Ambient Frequency Synthesizer */}
          <div className="editorial-card p-4 mb-4">
            <span className="editorial-label mb-2 d-block">AUDIO SYNTHESIS // ZERO DRIFT</span>
            <h3 className="font-headline fs-5 text-light mb-3">SYNTHESIZED AMBIENCE</h3>
            <p className="font-mono text-secondary mb-3" style={{ fontSize: '0.8rem' }}>
              Built-in Web Audio oscillator generating scientifically proven neural entrainment frequencies. 100% offline.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() => handleAmbientChange('NONE')}
                className={`editorial-badge btn ${ambientSound === 'NONE' ? 'bg-light text-dark' : ''}`}
              >
                <VolumeX size={13} /> SILENCE
              </button>
              <button
                onClick={() => handleAmbientChange('GAMMA_40HZ')}
                className={`editorial-badge btn ${ambientSound === 'GAMMA_40HZ' ? 'bg-light text-dark' : ''}`}
              >
                <Volume2 size={13} /> 40HZ GAMMA BINAURAL (FOCUS)
              </button>
              <button
                onClick={() => handleAmbientChange('BROWN_NOISE')}
                className={`editorial-badge btn ${ambientSound === 'BROWN_NOISE' ? 'bg-light text-dark' : ''}`}
              >
                <Volume2 size={13} /> DEEP BROWN NOISE (ISOLATION)
              </button>
            </div>
          </div>

          {/* Tag & Metadata Selector */}
          <div className="editorial-card p-4 mb-4">
            <span className="editorial-label mb-2 d-block">TELEMETRY TAGGING</span>
            <div className="row g-3">
              <div className="col-6">
                <label className="editorial-label mb-2 d-block">DOMAIN TAG</label>
                <select
                  className="editorial-input"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                >
                  <option value="DEEP_WORK">DEEP WORK</option>
                  <option value="CODE">CODE ARCHITECTURE</option>
                  <option value="NQT_PREP">NQT PREPARATION</option>
                  <option value="READING">RESEARCH / STUDY</option>
                  <option value="WRITING">TECHNICAL WRITING</option>
                </select>
              </div>
              <div className="col-6">
                <label className="editorial-label mb-2 d-block">CUSTOM TIME (MINS)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  className="editorial-input"
                  value={customMinutes}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setCustomMinutes(m);
                    if (mode === 'CUSTOM') {
                      handleModeChange('CUSTOM', m);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Chronological Focus Audit */}
          <div className="editorial-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="editorial-label">RECENT SPRINT LOGS</span>
              <span className="editorial-label">TOTAL: {stats?.todayMinutes || 0} MINS TODAY</span>
            </div>

            {history && history.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {history.slice(0, 5).map(s => (
                  <div
                    key={s.id}
                    className="p-2 border d-flex justify-content-between align-items-center font-mono"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)', fontSize: '0.8rem' }}
                  >
                    <div>
                      <span className="text-light fw-bold">{s.durationMinutes} MINS</span>
                      <span className="text-secondary ms-2">// {s.tag} ({s.sessionType})</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center font-mono text-secondary py-3" style={{ fontSize: '0.82rem' }}>
                No completed focus blocks today. Complete your first 25-minute sprint.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
