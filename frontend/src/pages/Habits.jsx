import React, { useState, useEffect } from 'react';
import { habitsApi } from '../services/api';
import { Plus, Flame, Check, X, Trash2, Calendar, Target, Award, CheckCircle2 } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DISCIPLINE');
  const [targetDays, setTargetDays] = useState(7);

  const categories = ['DISCIPLINE', 'CODING', 'LEARNING', 'FOCUS', 'HEALTH'];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    setLoading(true);
    habitsApi.getAll()
      .then(res => {
        if (res.data && res.data.data) {
          setHabits(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    habitsApi.create({
      title: title.trim(),
      description,
      category,
      targetDaysPerWeek: Number(targetDays)
    })
      .then(() => {
        setShowModal(false);
        setTitle('');
        setDescription('');
        loadHabits();
      })
      .catch(console.error);
  };

  const toggleDay = (habitId, dateStr) => {
    habitsApi.toggle(habitId, dateStr)
      .then(() => loadHabits())
      .catch(console.error);
  };

  const handleDelete = (habitId) => {
    if (window.confirm('Delete this habit protocol?')) {
      habitsApi.delete(habitId)
        .then(() => loadHabits())
        .catch(console.error);
    }
  };

  // Generate last 7 days array for the weekly matrix header
  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    weekDays.push({ iso, dayName, dayNum, isToday: i === 0 });
  }

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">PROTOCOL ENGINE // INVARIANTS</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            HABIT & DISCIPLINE MATRIX
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Streaks computed strictly from genuine database completion logs. Zero synthetic estimations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="editorial-btn editorial-btn-primary mt-3 mt-md-0"
        >
          <Plus size={16} />
          <span>NEW HABIT PROTOCOL</span>
        </button>
      </div>

      {/* Summary KPI Tiles */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="editorial-card p-3">
            <span className="editorial-label">ACTIVE PROTOCOLS</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1">{habits.length}</div>
            <div className="editorial-label mt-1">TRACKED INVARIANTS</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="editorial-card p-3">
            <span className="editorial-label">HIGHEST ACTIVE STREAK</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1 d-flex align-items-center gap-2">
              <Flame size={22} />
              {Math.max(0, ...habits.map(h => h.streakCount || 0))} <span className="fs-6 text-secondary">DAYS</span>
            </div>
            <div className="editorial-label mt-1">UNBROKEN MOMENTUM</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="editorial-card p-3">
            <span className="editorial-label">TODAY'S EXECUTION RATE</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1">
              {habits.length > 0 ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100) : 0}%
            </div>
            <div className="editorial-label mt-1">
              {habits.filter(h => h.completedToday).length} / {habits.length} CHECKED TODAY
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Matrix Table */}
      <div className="editorial-card p-0 overflow-hidden mb-5">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 text-white" style={{ background: 'transparent' }}>
            <thead>
              <tr className="border-bottom" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <th className="py-3 px-4 font-mono editorial-label" style={{ minWidth: '220px' }}>HABIT PROTOCOL</th>
                <th className="py-3 px-3 font-mono editorial-label text-center">STREAK</th>
                {weekDays.map(d => (
                  <th key={d.iso} className={`py-3 px-2 font-mono text-center ${d.isToday ? 'border-start border-end' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                    <div className="editorial-label" style={{ fontSize: '0.65rem' }}>{d.dayName}</div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{d.dayNum}</div>
                  </th>
                ))}
                <th className="py-3 px-3 font-mono editorial-label text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="py-3 px-4">
                    <div className="font-mono fw-bold text-light" style={{ fontSize: '0.9rem' }}>{habit.title}</div>
                    {habit.description && (
                      <div className="text-secondary font-mono" style={{ fontSize: '0.75rem' }}>{habit.description}</div>
                    )}
                    <span className="editorial-badge mt-1" style={{ fontSize: '0.62rem' }}>{habit.category}</span>
                  </td>

                  <td className="py-3 px-3 text-center align-middle">
                    <span className="font-mono fw-bold d-inline-flex align-items-center gap-1 text-light" style={{ fontSize: '0.9rem' }}>
                      <Flame size={14} /> {habit.streakCount}d
                    </span>
                  </td>

                  {weekDays.map(d => {
                    const isDone = habit.recentLogs && habit.recentLogs[d.iso];
                    return (
                      <td
                        key={d.iso}
                        className={`text-center align-middle p-2 ${d.isToday ? 'border-start border-end' : ''}`}
                        style={{ borderColor: 'var(--border-subtle)', background: d.isToday ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                      >
                        <button
                          onClick={() => toggleDay(habit.id, d.iso)}
                          className={`btn p-2 transition-smooth rounded-0 border`}
                          style={{
                            width: '32px',
                            height: '32px',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: isDone ? '#FFFFFF' : 'var(--border-color)',
                            backgroundColor: isDone ? '#FFFFFF' : 'transparent',
                            color: isDone ? '#050505' : 'transparent',
                          }}
                          title={`Toggle ${d.iso}`}
                        >
                          {isDone ? <Check size={16} strokeWidth={3} /> : null}
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-3 px-3 text-end align-middle">
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="btn p-1 text-secondary hover-white"
                      title="Archive Habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Habit Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1200, backdropFilter: 'blur(8px)' }}
        >
          <div className="editorial-card p-4 p-md-5" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-card)' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-color)' }}>
              <span className="editorial-label">CREATE INVARIANT PROTOCOL</span>
              <button onClick={() => setShowModal(false)} className="btn p-0 text-secondary hover-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">HABIT TITLE</label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="e.g. 50-Min Deep Code Block"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">DESCRIPTION / STANDARD</label>
                <textarea
                  className="editorial-input"
                  rows="2"
                  placeholder="Define the non-negotiable threshold of completion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">CATEGORY</label>
                  <select
                    className="editorial-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">DAYS / WEEK</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    className="editorial-input"
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="editorial-btn editorial-btn-primary w-100 py-3">
                  COMMIT PROTOCOL
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="editorial-btn editorial-btn-ghost py-3"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
