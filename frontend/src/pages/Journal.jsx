import React, { useState, useEffect } from 'react';
import { journalApi } from '../services/api';
import { Plus, Search, Heart, Trash2, Calendar, Tag, Smile, Edit3, X, BookOpen } from 'lucide-react';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Editor Modal / Active Form
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('FOCUSED');
  const [tags, setTags] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  const moods = ['ENERGIZED', 'FOCUSED', 'NEUTRAL', 'REFLECTIVE', 'FATIGUED'];

  useEffect(() => {
    loadEntries();
  }, [searchQuery, selectedMood, showFavoritesOnly]);

  const loadEntries = () => {
    setLoading(true);
    journalApi.getAll({
      query: searchQuery || null,
      mood: selectedMood !== 'ALL' ? selectedMood : null,
      favorite: showFavoritesOnly ? true : null
    })
      .then(res => setEntries(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags,
      entryDate
    };

    if (editingId) {
      journalApi.update(editingId, payload).then(() => {
        closeEditor();
        loadEntries();
      });
    } else {
      journalApi.create(payload).then(() => {
        closeEditor();
        loadEntries();
      });
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || 'FOCUSED');
    setTags(entry.tags || '');
    setEntryDate(entry.entryDate || new Date().toISOString().split('T')[0]);
    setShowEditor(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Erase this reflection from the deep chamber?')) {
      journalApi.delete(id).then(() => loadEntries());
    }
  };

  const handleToggleFavorite = (id) => {
    journalApi.toggleFavorite(id).then(() => loadEntries());
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setTags('');
    setMood('FOCUSED');
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">PRIVATE CHAMBER // THE EXAMINED LIFE</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            DEEP INTELLECTUAL JOURNAL
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Strictly isolated private reflections. No external telemetry, zero unauthenticated endpoints.
          </p>
        </div>

        <button
          onClick={() => { closeEditor(); setShowEditor(true); }}
          className="editorial-btn editorial-btn-primary mt-3 mt-md-0"
        >
          <Plus size={15} />
          <span>NEW REFLECTION</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="position-relative">
            <input
              type="text"
              className="editorial-input ps-5"
              placeholder="Search thoughts, tags, or lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          </div>
        </div>

        <div className="col-lg-7">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end align-items-center">
            <span className="editorial-label me-1">MOOD:</span>
            <button
              onClick={() => setSelectedMood('ALL')}
              className={`editorial-badge btn ${selectedMood === 'ALL' ? 'bg-light text-dark' : ''}`}
            >
              ALL
            </button>
            {moods.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`editorial-badge btn ${selectedMood === m ? 'bg-light text-dark' : ''}`}
              >
                {m}
              </button>
            ))}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`editorial-badge btn ${showFavoritesOnly ? 'bg-light text-dark' : ''}`}
            >
              <Heart size={12} fill={showFavoritesOnly ? 'currentColor' : 'none'} className="me-1" />
              FAVORITES
            </button>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="row g-4">
        {entries.map(entry => (
          <div key={entry.id} className="col-lg-6">
            <div className="editorial-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="editorial-badge">{entry.mood}</span>
                    <span className="editorial-label d-flex align-items-center gap-1">
                      <Calendar size={12} /> {entry.entryDate}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <button
                      onClick={() => handleToggleFavorite(entry.id)}
                      className={`btn p-1 ${entry.favorite ? 'text-danger' : 'text-secondary'}`}
                    >
                      <Heart size={15} fill={entry.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="btn p-1 text-secondary hover-white"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="btn p-1 text-secondary hover-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="font-headline fs-4 text-light fw-bold my-2">{entry.title}</h3>

                <p className="font-serif fst-italic text-secondary mb-4" style={{ fontSize: '0.98rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {entry.content}
                </p>
              </div>

              {entry.tags && (
                <div className="pt-3 border-top d-flex flex-wrap gap-1" style={{ borderColor: 'var(--border-subtle)' }}>
                  {entry.tags.split(',').map((tagStr, i) => (
                    <span key={i} className="editorial-label" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      #{tagStr.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="col-12">
            <div className="editorial-card p-5 text-center font-mono text-secondary">
              No entries found. Document your thoughts and stoic reflections.
            </div>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1200, backdropFilter: 'blur(8px)' }}
        >
          <div className="editorial-card p-4 p-md-5" style={{ maxWidth: '640px', width: '100%', background: 'var(--bg-card)' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-color)' }}>
              <span className="editorial-label">{editingId ? 'EDIT REFLECTION' : 'RECORD ENTRY'}</span>
              <button onClick={closeEditor} className="btn p-0 text-secondary hover-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">ENTRY TITLE</label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="e.g. On Cognitive Friction and Alignment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">COGNITIVE MOOD</label>
                  <select
                    className="editorial-input"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    {moods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">ENTRY DATE</label>
                  <input
                    type="date"
                    className="editorial-input"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">PRIVATE REFLECTION</label>
                <textarea
                  className="editorial-input"
                  rows="7"
                  placeholder="Analyze today's performance, friction points, breakthroughs, and philosophical invariants..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="editorial-label mb-2 d-block">TAXONOMY TAGS (COMMA-SEPARATED)</label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="architecture, discipline, nqt, algorithm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="editorial-btn editorial-btn-primary w-100 py-3">
                  SEAL REFLECTION
                </button>
                <button type="button" onClick={closeEditor} className="editorial-btn editorial-btn-ghost py-3">
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
