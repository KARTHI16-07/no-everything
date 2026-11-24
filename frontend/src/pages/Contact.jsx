import React, { useState } from 'react';
import { Mail, Terminal, Send, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container px-lg-5 px-3 py-5" style={{ marginTop: '80px', minHeight: '90vh' }}>
      <div className="pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)', maxWidth: '780px' }}>
        <span className="editorial-label">COMMUNICATIONS // SECURE CHANNELS</span>
        <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
          INITIATE COMMUNICATION
        </h1>
        <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
          Connect with the NO EVERYTHING product team, propose curriculum additions, or report architectural inquiries.
        </p>
      </div>

      <div className="row g-5">
        <div className="col-lg-6">
          <div className="editorial-card p-4 p-md-5 h-100">
            {submitted ? (
              <div className="text-center py-5">
                <CheckCircle2 size={48} className="text-light mb-3" />
                <h3 className="font-headline fs-3 text-light">TRANSMISSION RECEIVED</h3>
                <p className="font-mono text-secondary mt-2">
                  Your communication has been encrypted and dispatched to the station architecture team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="editorial-label mb-2 d-block">NAME / CALLSIGN</label>
                  <input
                    type="text"
                    className="editorial-input"
                    placeholder="Kaelen Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="editorial-label mb-2 d-block">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="editorial-input"
                    placeholder="builder@noeverything.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="editorial-label mb-2 d-block">MESSAGE CONTENT</label>
                  <textarea
                    className="editorial-input"
                    rows="5"
                    placeholder="Inquiry, feedback, partnership, or technical suggestion..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="editorial-btn editorial-btn-primary w-100 py-3">
                  <Send size={15} />
                  <span>TRANSMIT DISPATCH</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="editorial-card p-4 p-md-5 h-100" style={{ background: 'var(--bg-secondary)' }}>
            <span className="editorial-label mb-3 d-block">DIRECT CHANNELS</span>
            <div className="d-flex flex-column gap-4 font-mono">
              <div>
                <div className="editorial-label mb-1">HEADQUARTERS DISPATCH</div>
                <div className="fs-5 text-light fw-bold">dispatch@noeverything.com</div>
              </div>
              <div>
                <div className="editorial-label mb-1">ARCHITECTURAL LEAD</div>
                <div className="fs-5 text-light fw-bold">systems@noeverything.com</div>
              </div>
              <div>
                <div className="editorial-label mb-1">TELEMETRY ENCRYPTION</div>
                <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  2048-BIT RSA / STATISTICAL MONOCHROME VERIFICATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
