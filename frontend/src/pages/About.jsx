import React from 'react';
import { Link } from 'react-router-dom';
import LogoMonogram from '../components/LogoMonogram';
import { ArrowUpRight, ShieldCheck, Zap, Terminal, Compass } from 'lucide-react';

export default function About() {
  return (
    <div className="container px-lg-5 px-3 py-5" style={{ marginTop: '80px', minHeight: '90vh' }}>
      <div className="text-center mb-5 pb-4 border-bottom" style={{ borderColor: 'var(--border-color)', maxWidth: '780px', margin: '0 auto' }}>
        <div className="mb-4">
          <LogoMonogram width={160} height={48} showWordmark={true} />
        </div>
        <span className="editorial-label">PHILOSOPHICAL CODEX // ROOT PRINCIPLES</span>
        <h1 className="font-headline display-4 fw-bold text-uppercase mt-2 mb-3">
          ABOUT NO EVERYTHING
        </h1>
        <p className="font-serif fst-italic fs-5 text-secondary">
          "The platform representing the idea that there are no unnecessary limits to personal growth, creativity, discipline, and achievement."
        </p>
      </div>

      <div className="row g-5 mb-5 align-items-center">
        <div className="col-lg-6">
          <span className="editorial-label">01 // ORIGIN & MEANING</span>
          <h2 className="font-headline fs-2 text-light fw-bold my-3">THE METRIC OF DELIBERATE SUBTRACTION</h2>
          <p className="font-mono text-secondary mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            In modern society, humans are inundated with excessive notifications, false obligations, and synthetic dopamine loops. We believe radical simplicity and intense discipline are the twin engines of human greatness.
          </p>
          <p className="font-mono text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            When you say <strong>NO EVERYTHING</strong> to distractions, excuses, and artificial ceilings, you unlock the solitary state where monumental achievement becomes predictable.
          </p>
        </div>

        <div className="col-lg-6">
          <div className="editorial-card p-4 p-md-5" style={{ background: 'var(--bg-secondary)' }}>
            <span className="editorial-label mb-2 d-block">MONOGRAM GEOMETRY</span>
            <h3 className="font-headline fs-4 text-light mb-3">THE "NE —●" EMBLEM</h3>
            <p className="font-mono text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.7' }}>
              The monogram connects the letters <strong>N</strong> and <strong>E</strong> through their exact horizontal center, projecting a razor hairline towards the infinite right and terminating in a singular point. It signifies uninterrupted momentum moving from zero to absolute focus.
            </p>
          </div>
        </div>
      </div>

      <div className="editorial-card p-4 p-md-5 text-center my-5" style={{ background: 'var(--bg-card)' }}>
        <h2 className="font-headline fs-2 fw-bold text-light mb-3">READY TO INITIATE YOUR TRAJECTORY?</h2>
        <p className="font-mono text-secondary mb-4 mx-auto" style={{ maxWidth: '520px', fontSize: '0.88rem' }}>
          Enter the personal growth cockpit. Zero ads, zero social algorithms, pure intellectual mastery.
        </p>
        <Link to="/auth" className="editorial-btn editorial-btn-primary py-3 px-5">
          <span>ENTER NO EVERYTHING</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
