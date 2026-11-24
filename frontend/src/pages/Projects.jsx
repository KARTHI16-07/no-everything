import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, Database, Cpu, Compass, Layers, Terminal } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: '01',
      title: 'High-Throughput Reactive Micro-Services',
      category: 'SYSTEMS ARCHITECTURE',
      tech: ['JAVA 17', 'SPRING BOOT 3', 'KAFKA', 'MYSQL'],
      desc: 'Architecting resilient transactional pipelines with idempotent message deduplication and non-blocking I/O.',
      status: 'CURATED TRAJECTORY'
    },
    {
      id: '02',
      title: 'Algorithmic Mastery & Competitive Exam Crucible',
      category: 'NQT & PLACEMENT',
      tech: ['DATA STRUCTURES', 'SLIDING WINDOW', 'DYNAMIC PROGRAMMING', 'SQL JOINS'],
      desc: 'Complete mastery of competitive pattern recognition, complexity bounds, and previous-year test solutions.',
      status: 'STANDARDIZED SUITE'
    },
    {
      id: '03',
      title: 'Autonomous Multimodal AI Orchestration',
      category: 'AI / AGENTIC SYSTEMS',
      tech: ['GEMINI 1.5', 'REST PROXY', 'PROMPT ENGINEERING', 'CONTEXT BUS'],
      desc: 'Building intelligent multi-agent workspaces that synthesize code, conduct mock trials, and eliminate doubts.',
      status: 'PRODUCTION DEPLOYED'
    },
    {
      id: '04',
      title: 'Stoic Execution & Habit Invariant Engine',
      category: 'DISCIPLINE ARCHITECTURE',
      tech: ['CHRONOLOGICAL AUDITING', 'CONSECUTIVE STREAKS', 'POMODORO FREQUENCIES'],
      desc: 'A quantifiable operating system for daily habits, eliminating willpower depletion through deterministic schedules.',
      status: 'CORE MODULE'
    }
  ];

  return (
    <div className="container px-lg-5 px-3 py-5" style={{ marginTop: '80px', minHeight: '90vh' }}>
      <div className="pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <span className="editorial-label">CURATED DIRECTORY // MASTERY PATHS</span>
        <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
          FEATURED PROJECTS & BLUEPRINTS
        </h1>
        <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
          Production-grade engineering blueprints designed for high-leverage skill acquisition.
        </p>
      </div>

      <div className="d-flex flex-column gap-4">
        {projects.map(p => (
          <div key={p.id} className="editorial-card p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="editorial-badge">{p.category} // {p.status}</span>
              <span className="font-mono text-secondary" style={{ fontSize: '0.85rem' }}>PATH {p.id}</span>
            </div>
            <h2 className="font-headline fs-2 text-light fw-bold mb-3">{p.title}</h2>
            <p className="font-mono text-secondary mb-4" style={{ fontSize: '0.88rem', maxWidth: '720px' }}>
              {p.desc}
            </p>
            <div className="d-flex flex-wrap gap-2 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              {p.tech.map((t, idx) => (
                <span key={idx} className="editorial-badge">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
