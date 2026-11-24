import React, { useState, useEffect } from 'react';
import { challengesApi, achievementsApi } from '../services/api';
import { Award, Zap, Flame, Shield, CheckCircle2, Clock, Sparkles, Trophy, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('CHALLENGES'); // 'CHALLENGES' or 'ACHIEVEMENTS'
  const [challengeType, setChallengeType] = useState('ALL');
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [challengeType, activeTab]);

  const loadData = () => {
    setLoading(true);
    if (activeTab === 'CHALLENGES') {
      challengesApi.getAll(challengeType !== 'ALL' ? challengeType : null)
        .then(res => setChallenges(res.data.data || []))
        .finally(() => setLoading(false));
    } else {
      achievementsApi.getAll()
        .then(res => setAchievements(res.data.data || []))
        .finally(() => setLoading(false));
    }
  };

  const handleJoin = (id) => {
    challengesApi.join(id)
      .then(() => {
        try {
          confetti({ particleCount: 50, spread: 45 });
        } catch (e) {}
        loadData();
      });
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">CRUCIBLE ARENA // VERIFIABLE HONORS</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            CHALLENGES & ACHIEVEMENTS
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Earn verifiable badges and complete high-difficulty discipline sprints.
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0 font-mono">
          <button
            onClick={() => setActiveTab('CHALLENGES')}
            className={`editorial-btn ${activeTab === 'CHALLENGES' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
          >
            <Zap size={14} />
            <span>SPRINTS & QUESTS</span>
          </button>
          <button
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`editorial-btn ${activeTab === 'ACHIEVEMENTS' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
          >
            <Award size={14} />
            <span>HALL OF HONORS</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHALLENGES */}
      {activeTab === 'CHALLENGES' && (
        <div>
          {/* Challenge Type Filters */}
          <div className="d-flex gap-2 mb-4">
            {['ALL', 'DAILY', 'WEEKLY', 'SPECIAL'].map(type => (
              <button
                key={type}
                onClick={() => setChallengeType(type)}
                className={`editorial-badge btn ${challengeType === type ? 'bg-light text-dark' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {challenges.map(c => {
              const progressPct = c.targetValue > 0 ? Math.min(100, (c.userCurrentValue / c.targetValue) * 100) : 0;
              return (
                <div key={c.id} className="col-lg-4 col-md-6">
                  <div
                    className="editorial-card p-4 h-100 d-flex flex-column justify-content-between"
                    style={{
                      background: c.userCompleted ? 'var(--bg-secondary)' : 'var(--bg-card)',
                      borderColor: c.userCompleted ? '#FFFFFF' : 'var(--border-color)',
                    }}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="editorial-badge">{c.type} // +{c.xpReward} XP</span>
                        {c.userCompleted && (
                          <span className="editorial-badge border-light text-light d-flex align-items-center gap-1">
                            <CheckCircle2 size={12} /> CONQUERED
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline fs-4 text-light fw-bold mb-2">{c.title}</h3>
                      <p className="font-mono text-secondary mb-4" style={{ fontSize: '0.85rem' }}>
                        {c.description}
                      </p>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between font-mono mb-1" style={{ fontSize: '0.75rem' }}>
                          <span className="editorial-label">CRITERIA</span>
                          <span className="text-light">
                            {c.userCurrentValue || 0} / {c.targetValue} {c.unitLabel}
                          </span>
                        </div>
                        <div className="progress rounded-0" style={{ height: '4px', background: 'var(--border-subtle)' }}>
                          <div
                            className="progress-bar bg-light"
                            role="progressbar"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {!c.joined && !c.userCompleted && (
                        <button
                          onClick={() => handleJoin(c.id)}
                          className="editorial-btn editorial-btn-outline w-100 py-2"
                        >
                          ACCEPT PROTOCOL
                        </button>
                      )}

                      {c.joined && !c.userCompleted && (
                        <div className="p-2 border text-center font-mono" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          ENROLLED // IN EXECUTION
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS */}
      {activeTab === 'ACHIEVEMENTS' && (
        <div className="row g-4">
          {achievements.map(a => (
            <div key={a.id} className="col-lg-4 col-md-6">
              <div
                className="editorial-card p-4 h-100 d-flex flex-column justify-content-between"
                style={{
                  opacity: a.unlocked ? 1 : 0.65,
                  background: a.unlocked ? 'var(--bg-card)' : 'var(--bg-secondary)',
                  borderColor: a.unlocked ? '#FFFFFF' : 'var(--border-subtle)',
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="editorial-badge">{a.rarity} // {a.category}</span>
                    {a.unlocked ? (
                      <Trophy size={18} className="text-light" />
                    ) : (
                      <Lock size={16} className="text-muted" />
                    )}
                  </div>

                  <h3 className="font-headline fs-4 text-light fw-bold mb-2">{a.title}</h3>
                  <p className="font-mono text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                    {a.description}
                  </p>
                </div>

                <div className="pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="d-flex justify-content-between align-items-center font-mono" style={{ fontSize: '0.75rem' }}>
                    <span className="editorial-label">
                      {a.unlocked ? 'HONOR UNLOCKED' : `TARGET: ${a.thresholdValue}`}
                    </span>
                    <span className="text-light fw-bold">
                      {a.unlocked ? 'VERIFIED' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
