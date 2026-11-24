import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoMonogram from './LogoMonogram';
import { ArrowUp, Terminal, Shield, Cpu, Activity } from 'lucide-react';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toTimeString().split(' ')[0] + ' ' + (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-top py-5 mt-5"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="container-fluid px-lg-5 px-3">
        <div className="row g-5 mb-5">
          {/* Col 1: Brand & Philosophy */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <LogoMonogram width={150} height={44} showWordmark={true} />
            </div>
            <p className="font-serif fst-italic text-secondary mb-4" style={{ fontSize: '1.05rem', maxWidth: '340px' }}>
              "We exist to create and champion the exceptional through radical elimination of the non-essential."
            </p>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  boxShadow: '0 0 10px #4ade80',
                }}
              />
              <span className="editorial-label" style={{ color: 'var(--text-secondary)' }}>
                SYSTEM STATUS : ALL PROTOCOLS NOMINAL
              </span>
            </div>
          </div>

          {/* Col 2: Platform Pillars */}
          <div className="col-lg-2 col-6">
            <div className="editorial-label mb-3">PILLARS</div>
            <ul className="list-unstyled d-flex flex-column gap-2 font-mono" style={{ fontSize: '0.82rem' }}>
              <li><Link to="/habits" className="text-secondary text-decoration-none transition-smooth hover-white">HABIT ENGINE</Link></li>
              <li><Link to="/focus" className="text-secondary text-decoration-none transition-smooth hover-white">FOCUS LABORATORY</Link></li>
              <li><Link to="/journal" className="text-secondary text-decoration-none transition-smooth hover-white">DEEP JOURNAL</Link></li>
              <li><Link to="/nqt" className="text-secondary text-decoration-none transition-smooth hover-white">NQT CRUCIBLE</Link></li>
              <li><Link to="/ai-assistant" className="text-secondary text-decoration-none transition-smooth hover-white">GEMINI MIND</Link></li>
              <li><Link to="/analytics" className="text-secondary text-decoration-none transition-smooth hover-white">PERSONAL ANALYTICS</Link></li>
            </ul>
          </div>

          {/* Col 3: Architecture & System */}
          <div className="col-lg-2 col-6">
            <div className="editorial-label mb-3">SYSTEM</div>
            <ul className="list-unstyled d-flex flex-column gap-2 font-mono" style={{ fontSize: '0.82rem' }}>
              <li><Link to="/projects" className="text-secondary text-decoration-none transition-smooth hover-white">CURATED PROJECTS</Link></li>
              <li><Link to="/quotes" className="text-secondary text-decoration-none transition-smooth hover-white">DAILY ARCHIVE</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none transition-smooth hover-white">MANIFESTO</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none transition-smooth hover-white">COMMUNICATIONS</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none transition-smooth hover-white">SOURCE REPOSITORY</a></li>
            </ul>
          </div>

          {/* Col 4: Telemetry & Controls */}
          <div className="col-lg-4 col-md-6">
            <div className="editorial-label mb-3">SYSTEM TELEMETRY</div>
            <div className="editorial-card p-3 mb-3" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="editorial-label">STATION TIME</span>
                <span className="font-mono fs-6 text-light">{time}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="editorial-label">BACKEND ARCHITECTURE</span>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>SPRING BOOT 3 / JAVA 17</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="editorial-label">AI REASONING</span>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>GEMINI 1.5 FLASH (6 MODES)</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="editorial-btn editorial-btn-outline w-100 py-2 d-flex align-items-center justify-content-between"
            >
              <span>RETURN TO SUMMIT</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Hairline Divider & Bottom Copyright */}
        <div className="editorial-divider-subtle mb-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>
            &copy; {new Date().getFullYear()} NO EVERYTHING. ALL PROTOCOLS RESERVED. DESIGNED WITH SWISS BRUTALIST PRECISION.
          </div>
          <div className="d-flex gap-4">
            <span>INVARIANT DISCIPLINE</span>
            <span>ZERO COMPROMISE</span>
            <span>LIMITLESS HORIZON</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
