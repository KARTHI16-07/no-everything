import React, { useState, useEffect } from 'react';
import { quotesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, Copy, Share2, Shuffle, Check, Sparkles, Filter } from 'lucide-react';

export default function Quotes() {
  const { isAuthenticated } = useAuth();
  const [dailyQuote, setDailyQuote] = useState(null);
  const [quotesList, setQuotesList] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [shareToast, setShareToast] = useState('');

  const categories = ['ALL', 'VISION', 'DISCIPLINE', 'MASTERY', 'FOCUS', 'RESILIENCE', 'CODING'];

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      quotesApi.getDaily(),
      quotesApi.search(searchQuery, category)
    ])
      .then(([dailyRes, listRes]) => {
        if (dailyRes.data && dailyRes.data.data) {
          setDailyQuote(dailyRes.data.data);
        }
        if (listRes.data && listRes.data.data) {
          setQuotesList(listRes.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    quotesApi.search(searchQuery, category)
      .then(res => {
        if (res.data && res.data.data) {
          setQuotesList(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleRandom = () => {
    quotesApi.getRandom()
      .then(res => {
        if (res.data && res.data.data) {
          setDailyQuote(res.data.data);
        }
      });
  };

  const toggleFavorite = (quoteId) => {
    if (!isAuthenticated) return;
    quotesApi.toggleFavorite(quoteId)
      .then(res => {
        const isFav = res.data.data;
        if (dailyQuote && dailyQuote.id === quoteId) {
          setDailyQuote(prev => ({ ...prev, isFavorite: isFav }));
        }
        setQuotesList(prev => prev.map(q => q.id === quoteId ? { ...q, isFavorite: isFav } : q));
      });
  };

  const copyQuote = (quote, id) => {
    navigator.clipboard.writeText(`"${quote.quoteText}" — ${quote.author}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareQuote = (quote) => {
    if (navigator.share) {
      navigator.share({
        title: 'NO EVERYTHING Theorem',
        text: `"${quote.quoteText}" — ${quote.author}`,
      }).catch(() => {});
    } else {
      copyQuote(quote, quote.id);
      setShareToast('Quote transcribed to clipboard.');
      setTimeout(() => setShareToast(''), 3000);
    }
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">ARCHIVE // AXIOMS OF MASTERY</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            STOIC & INTELLECTUAL THEOREMS
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Daily wisdom distilled from philosophers, system architects, and master engineers.
          </p>
        </div>

        <button onClick={handleRandom} className="editorial-btn editorial-btn-outline mt-3 mt-md-0 font-mono">
          <Shuffle size={14} />
          <span>RANDOM THEOREM</span>
        </button>
      </div>

      {shareToast && (
        <div className="alert alert-dark rounded-0 border font-mono p-3 mb-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          {shareToast}
        </div>
      )}

      {/* Featured Theorem of the Day */}
      {dailyQuote && (
        <div className="editorial-card p-4 p-md-5 mb-5" style={{ background: 'var(--bg-secondary)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="editorial-badge">THE INVARIANT DICTUM // TODAY</span>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => toggleFavorite(dailyQuote.id)}
                className={`editorial-btn-ghost p-2 ${dailyQuote.isFavorite ? 'text-danger' : 'text-secondary'}`}
                title="Bookmark Quote"
              >
                <Heart size={18} fill={dailyQuote.isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => copyQuote(dailyQuote, dailyQuote.id)}
                className="editorial-btn-ghost p-2"
                title="Copy to Clipboard"
              >
                {copiedId === dailyQuote.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={() => shareQuote(dailyQuote)}
                className="editorial-btn-ghost p-2"
                title="Share Quote"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <blockquote className="font-serif quote-editorial mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}>
            "{dailyQuote.quoteText}"
          </blockquote>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-4 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <div className="font-headline fs-5 fw-bold">{dailyQuote.author}</div>
              <div className="editorial-label mt-1">{dailyQuote.category} DISCIPLINE</div>
            </div>
            <div className="font-mono text-secondary mt-3 mt-md-0" style={{ maxWidth: '480px', fontSize: '0.85rem' }}>
              {dailyQuote.explanation}
            </div>
          </div>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-lg-6">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="editorial-input"
              placeholder="Search by keywords or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="editorial-btn editorial-btn-outline px-4">
              <Search size={15} />
            </button>
          </form>
        </div>

        <div className="col-lg-6">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="editorial-badge btn transition-smooth"
                style={{
                  background: category === cat ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: category === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  borderColor: category === cat ? 'var(--text-primary)' : 'var(--border-color)',
                  cursor: 'pointer',
                  padding: '0.4rem 0.8rem',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="row g-4">
        {quotesList.map((q) => (
          <div key={q.id} className="col-lg-4 col-md-6">
            <div className="editorial-card h-100 d-flex flex-column justify-content-between p-4">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="editorial-badge">{q.category}</span>
                  <div className="d-flex gap-1">
                    <button
                      onClick={() => toggleFavorite(q.id)}
                      className={`btn p-1 ${q.isFavorite ? 'text-danger' : 'text-secondary'}`}
                    >
                      <Heart size={15} fill={q.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => copyQuote(q, q.id)}
                      className="btn p-1 text-secondary hover-white"
                    >
                      {copiedId === q.id ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    <button
                      onClick={() => shareQuote(q)}
                      className="btn p-1 text-secondary hover-white"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
                <blockquote className="font-serif fst-italic mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                  "{q.quoteText}"
                </blockquote>
              </div>

              <div className="pt-3 border-top mt-auto" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="font-headline fw-bold" style={{ fontSize: '0.9rem' }}>{q.author}</div>
                <div className="editorial-label mt-1" style={{ fontSize: '0.65rem' }}>{q.explanation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
