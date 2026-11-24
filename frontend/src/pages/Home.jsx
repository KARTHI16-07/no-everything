import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotesApi } from '../services/api';
import LogoMonogram from '../components/LogoMonogram';
import FloatingPreview from '../components/FloatingPreview';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  Cpu,
  Flame,
  Code,
  Shield,
  Zap,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

export default function Home() {
  const [dailyQuote, setDailyQuote] = useState({
    quoteText: 'We exist to create and champion the exceptional.',
    author: 'NO EVERYTHING MANIFESTO',
    category: 'VISION',
    explanation: 'Excellence is not an accidental event; it is an invariant discipline of deliberate subtraction.'
  });
  const [copied, setCopied] = useState(false);
  const [activeAiMode, setActiveAiMode] = useState('LEARN');

  useEffect(() => {
    quotesApi.getDaily()
      .then(res => {
        if (res.data && res.data.data) {
          setDailyQuote(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const copyQuoteToClipboard = () => {
    navigator.clipboard.writeText(`"${dailyQuote.quoteText}" — ${dailyQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiModeDemos = {
    LEARN: {
      title: 'First-Principles Deconstruction',
      desc: 'Deep conceptual explanations in computer systems, algorithms, and cognitive performance.',
      samplePrompt: 'Explain how the Java Virtual Machine manages heap memory and generational garbage collection.',
      sampleAnswer: 'The JVM divides heap space into the Young Generation (Eden + 2 Survivor spaces) and Old (Tenured) Generation. New objects allocate in Eden; survivors of Minor GC passes advance to Tenured based on age threshold (tenuring threshold), minimizing stop-the-world pauses.'
    },
    PRACTICE: {
      title: 'Interactive Technical Drills',
      desc: 'Progressive technical challenges across Java, Python, and SQL with automated feedback.',
      samplePrompt: 'Write a SQL query to calculate the 7-day rolling average of user completions.',
      sampleAnswer: 'SELECT completion_date, AVG(completions) OVER(ORDER BY completion_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS rolling_avg FROM daily_stats;'
    },
    DOUBT: {
      title: 'Instant Debugging Crucible',
      desc: 'Surgical error dissection, race condition diagnosis, and complexity reduction.',
      samplePrompt: 'Why is ConcurrentHashMap thread-safe without synchronizing the entire table?',
      sampleAnswer: 'ConcurrentHashMap uses CAS (Compare-And-Swap) for empty bucket insertions and synchronized locks only on the root node of the target hash bucket bin, achieving fine-grained concurrency with zero whole-table locking.'
    },
    INTERVIEW: {
      title: 'Principal Architect Mock Trials',
      desc: 'Simulated high-bar technical interviews with rigorous architectural counter-questions.',
      samplePrompt: 'Design a distributed rate limiter supporting 100,000 requests per second.',
      sampleAnswer: 'We implement a Token Bucket algorithm backed by Redis clusters using Redis Lua scripts for atomic token decrement, supplemented with local client-side token caching to shield the Redis tier.'
    },
    EXAM: {
      title: 'NQT & Competitive Exam Engine',
      desc: 'Trap-avoidance strategies, time-management protocols, and verified previous-year solutions.',
      samplePrompt: 'Dissect the common trap in Java String equality vs object identity.',
      sampleAnswer: 'String literal instances utilize the JVM String Pool; instances created via new String() exist separately on the heap. Thus, "x" == new String("x") evaluates to false, while .equals() evaluates to true.'
    },
    REVISION: {
      title: 'High-Yield Synthesized Bullet Recaps',
      desc: 'Distilled cheat-sheets and mental models engineered for rapid recall under pressure.',
      samplePrompt: 'Quick recap: Time and space complexity of standard graph algorithms.',
      sampleAnswer: 'BFS: O(V + E) time, O(V) space. DFS: O(V + E) time, O(V) stack space. Dijkstra (with Min-Heap): O((V + E) log V) time, O(V) space. Bellman-Ford: O(V * E) time.'
    }
  };

  return (
    <div className="home-container">
      {/* =========================================================================
          SECTION 01 — HERO (THE SIGNATURE EXPERIENCE)
          ========================================================================= */}
      <section
        className="min-vh-100 d-flex flex-column justify-content-between position-relative pt-5 pb-4 px-lg-5 px-3 border-bottom editorial-grid-bg"
        style={{ borderColor: 'var(--border-color)', marginTop: '60px' }}
      >
        {/* Subtle architectural ambient illumination */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container-fluid p-0 my-auto py-5">
          <div className="row align-items-center g-5">
            {/* Left Column: Massive Headline & Philosophy */}
            <div className="col-xl-7 col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-4">
                <span className="editorial-label">PERSONAL GROWTH // ZERO COMPROMISE</span>
                <span className="editorial-badge">VERSION 1.0</span>
              </div>

              {/* Massive Bold Headline */}
              <h1
                className="font-headline text-uppercase mb-4"
                style={{
                  fontSize: 'clamp(3.4rem, 8vw, 7.8rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: '0.92',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                NO<br />
                EVERYTHING
              </h1>

              {/* Connecting line and dot motif */}
              <div className="d-flex align-items-center gap-3 my-4">
                <div style={{ height: '2px', width: '120px', background: 'var(--text-primary)' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)' }} className="pulse-dot" />
                <span className="editorial-label" style={{ letterSpacing: '0.25em' }}>LIMITLESS POTENTIAL</span>
              </div>

              {/* Dynamic Daily Quote in Hero */}
              <div className="mb-5" style={{ maxWidth: '620px' }}>
                <p className="font-serif fst-italic quote-editorial mb-2">
                  "{dailyQuote.quoteText}"
                </p>
                <div className="d-flex align-items-center gap-3">
                  <span className="editorial-label">— {dailyQuote.author}</span>
                  <span className="editorial-badge" style={{ fontSize: '0.65rem' }}>{dailyQuote.category}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/auth" className="editorial-btn editorial-btn-primary">
                  <span>ENTER THE ARENA</span>
                  <ArrowUpRight size={16} />
                </Link>
                <a href="#ecosystem" className="editorial-btn editorial-btn-outline">
                  <span>EXPLORE ECOSYSTEM</span>
                  <ArrowDown size={14} />
                </a>
              </div>
            </div>

            {/* Right Column: Floating Interactive Dashboard Preview */}
            <div className="col-xl-5 col-lg-6 d-flex justify-content-lg-end justify-content-center">
              <FloatingPreview />
            </div>
          </div>
        </div>

        {/* Hero Bottom Telemetry Bar */}
        <div className="d-flex justify-content-between align-items-end pt-4 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="editorial-label d-none d-md-block">
            LATENCY: 0.12MS // SWISS MINIMALISM // BRUTALIST PRECISION
          </div>
          <a
            href="#inspiration"
            className="text-decoration-none d-flex align-items-center gap-2 font-mono transition-smooth"
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.15em' }}
          >
            <span>SCROLL TO INITIATE</span>
            <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — DAILY INSPIRATION
          ========================================================================= */}
      <section id="inspiration" className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-3">
              <span className="editorial-label">02 // INSPIRATION ENGINE</span>
              <h2 className="font-headline fs-1 mt-2 mb-3">DAILY WISDOM CRUCIBLE</h2>
              <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                Every dawn delivers a calibrated stoic theorem. Internalize it. Execute with invariant precision.
              </p>
              <Link to="/quotes" className="editorial-btn editorial-btn-outline mt-3">
                <span>VIEW ARCHIVE</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="col-lg-9">
              <div className="editorial-card p-4 p-lg-5" style={{ background: 'var(--bg-secondary)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="editorial-badge">THE INVARIANT TRUTH</span>
                  <button
                    onClick={copyQuoteToClipboard}
                    className="editorial-btn editorial-btn-ghost p-2 d-flex align-items-center gap-2 font-mono"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'TRANSCRIBED' : 'COPY QUOTE'}</span>
                  </button>
                </div>
                <blockquote className="font-serif quote-editorial mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.3rem)' }}>
                  "{dailyQuote.quoteText}"
                </blockquote>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pt-4 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <div className="font-headline fw-bold" style={{ letterSpacing: '0.08em' }}>{dailyQuote.author}</div>
                    <div className="editorial-label mt-1">{dailyQuote.category} DISCIPLINE</div>
                  </div>
                  <div className="text-secondary font-mono" style={{ fontSize: '0.85rem', maxWidth: '480px' }}>
                    {dailyQuote.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — THE PHILOSOPHY
          ========================================================================= */}
      <section className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-5">
            <div className="col-lg-5">
              <span className="editorial-label">03 // THE PHILOSOPHY</span>
              <h2 className="font-headline display-4 text-uppercase fw-bold mt-2 mb-4" style={{ letterSpacing: '-0.03em' }}>
                RADICAL SUBTRACTION IS SUPREME POWER
              </h2>
              <div className="editorial-divider" />
              <p className="font-serif fst-italic fs-5 text-secondary">
                "Growth is never about adding more noise, more meetings, or more hollow metrics. Growth is the violent elimination of everything that prevents complete mastery."
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="editorial-card h-100 p-4">
                    <span className="font-mono text-muted fs-4">01</span>
                    <h3 className="font-headline fs-4 my-2">INVARIANT SYSTEMS</h3>
                    <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                      Motivation is a volatile biological emotion. Invariant systems execute regardless of fatigue, doubt, or circumstance.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="editorial-card h-100 p-4">
                    <span className="font-mono text-muted fs-4">02</span>
                    <h3 className="font-headline fs-4 my-2">RADICAL MONOCHROME</h3>
                    <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                      Eliminating decorative SaaS gradients and superficial gamification returns cognitive attention to the solitary truth: your work.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="editorial-card h-100 p-4">
                    <span className="font-mono text-muted fs-4">03</span>
                    <h3 className="font-headline fs-4 my-2">CRUCIBLE TESTING</h3>
                    <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                      Learning without rigorous simulation is delusion. Test under time pressure, examine failure points, and eliminate algorithmic blind spots.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="editorial-card h-100 p-4">
                    <span className="font-mono text-muted fs-4">04</span>
                    <h3 className="font-headline fs-4 my-2">LIMITLESS HORIZON</h3>
                    <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                      There are no ceilings except self-imposed compromises. When limits are recognized as illusions, achievement becomes deterministic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — EXPLORE THE ECOSYSTEM
          ========================================================================= */}
      <section id="ecosystem" className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="editorial-label">04 // ARCHITECTURE</span>
              <h2 className="font-headline display-5 text-uppercase fw-bold mt-2">
                THE SIX PILLARS OF MASTERY
              </h2>
            </div>
            <p className="text-secondary font-mono mt-3 mt-md-0" style={{ maxWidth: '400px', fontSize: '0.85rem' }}>
              A unified operational environment engineered for ambitious builders, students, and engineers.
            </p>
          </div>

          <div className="row g-4">
            {/* Module 1 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/habits" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <Flame size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 01</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">HABIT ENGINE</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  Genuine streak calculations derived from persistent database logs. Daily, weekly, and monthly discipline matrices.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  ENTER ENGINE <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>

            {/* Module 2 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/focus" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <Clock size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 02</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">FOCUS LABORATORY</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  25/5/15 Pomodoro and custom sessions paired with synthesized 40Hz Gamma binaural frequencies and session persistence.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  INITIATE SPRINT <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>

            {/* Module 3 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/journal" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <BookOpen size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 03</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">DEEP JOURNAL</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  Strict private user-isolated reflection chambers. Mood telemetry, tag indexing, and zero external exposure.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  RECORD THOUGHTS <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>

            {/* Module 4 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/nqt" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <Terminal size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 04</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">NQT LEARNING CENTER</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  Competitive exam mastery in Core Java, Python, SQL, and Aptitude with timed mock tests and verified previous-year questions.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  START PRACTICE <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>

            {/* Module 5 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/ai-assistant" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <Cpu size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 05</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">GEMINI AI MIND</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  Backend-proxied Gemini intelligence across 6 interaction modes: Learn, Practice, Doubt, Interview, Exam, and Revision.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  CONSULT AI <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>

            {/* Module 6 */}
            <div className="col-lg-4 col-md-6">
              <Link to="/analytics" className="editorial-card d-block text-decoration-none h-100 p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <Shield size={24} className="text-light" />
                  <span className="editorial-badge">PILLAR 06</span>
                </div>
                <h3 className="font-headline fs-4 text-light mb-2">PERSONAL ANALYTICS</h3>
                <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem' }}>
                  Pure database telemetry visualized via high-contrast monochrome charts: velocity, focus trends, and completion rate.
                </p>
                <div className="editorial-label text-light d-flex align-items-center gap-1">
                  VIEW METRICS <ArrowUpRight size={13} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — FEATURED PROJECTS & PATHS
          ========================================================================= */}
      <section className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-4">
              <span className="editorial-label">05 // CURATED PATHS</span>
              <h2 className="font-headline display-5 text-uppercase fw-bold mt-2 mb-3">
                HIGH-LEVERAGE BLUEPRINTS
              </h2>
              <p className="text-secondary font-mono" style={{ fontSize: '0.85rem' }}>
                Curated technical trajectories structured for rigorous real-world production engineering and competitive placement.
              </p>
              <Link to="/projects" className="editorial-btn editorial-btn-outline mt-3">
                <span>VIEW ALL PATHS</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                <div className="editorial-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="editorial-label">TRAJECTORY 01 // BACKEND SYSTEMS</span>
                    <span className="editorial-badge">PRODUCTION</span>
                  </div>
                  <h3 className="font-headline fs-3 text-light">Spring Boot 3 & Distributed Micro-Services</h3>
                  <p className="text-secondary font-mono mb-3" style={{ fontSize: '0.85rem' }}>
                    Master Spring Data JPA, stateless JWT filters, relational normalization, connection pooling, and resilient API contracts.
                  </p>
                  <div className="d-flex gap-2">
                    <span className="editorial-badge">JAVA 17</span>
                    <span className="editorial-badge">SPRING SECURITY</span>
                    <span className="editorial-badge">MYSQL</span>
                  </div>
                </div>

                <div className="editorial-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="editorial-label">TRAJECTORY 02 // ALGORITHMS</span>
                    <span className="editorial-badge">CRUCIBLE</span>
                  </div>
                  <h3 className="font-headline fs-3 text-light">NQT Algorithmic & Aptitude Mastery</h3>
                  <p className="text-secondary font-mono mb-3" style={{ fontSize: '0.85rem' }}>
                    Complete deep-dive into time-complexity traps, sliding windows, dynamic programming recurrence, and SQL joins.
                  </p>
                  <div className="d-flex gap-2">
                    <span className="editorial-badge">TCS NQT</span>
                    <span className="editorial-badge">INFOSYS DSE</span>
                    <span className="editorial-badge">WIPRO ELITE</span>
                  </div>
                </div>

                <div className="editorial-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="editorial-label">TRAJECTORY 03 // INTELLIGENCE</span>
                    <span className="editorial-badge">FRONTIER</span>
                  </div>
                  <h3 className="font-headline fs-3 text-light">Autonomous Agent Architecture with Gemini</h3>
                  <p className="text-secondary font-mono mb-3" style={{ fontSize: '0.85rem' }}>
                    Integrating multimodal generative intelligence via secure backend proxies with zero exposed frontend keys.
                  </p>
                  <div className="d-flex gap-2">
                    <span className="editorial-badge">GEMINI 1.5</span>
                    <span className="editorial-badge">PROMPT DESIGN</span>
                    <span className="editorial-badge">CONTEXT PIPELINES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — PERSONAL GROWTH FRAMEWORK
          ========================================================================= */}
      <section className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <span className="editorial-label">06 // GROWTH MATRIX</span>
            <h2 className="font-headline display-5 text-uppercase fw-bold mt-2">
              THE 4-STAGE EXECUTION ENGINE
            </h2>
            <p className="text-secondary font-mono mt-2" style={{ fontSize: '0.85rem' }}>
              A closed feedback loop transforming raw intent into verifiable personal sovereignty.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-sm-6">
              <div className="editorial-card h-100 p-4 text-center">
                <div className="editorial-badge mb-3">STAGE 01</div>
                <h3 className="font-headline fs-4 mb-2">COMMIT</h3>
                <p className="text-secondary font-mono" style={{ fontSize: '0.82rem' }}>
                  Define unyielding invariants. Establish daily focus blocks and high-impact tasks with zero ambiguity.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="editorial-card h-100 p-4 text-center">
                <div className="editorial-badge mb-3">STAGE 02</div>
                <h3 className="font-headline fs-4 mb-2">EXECUTE</h3>
                <p className="text-secondary font-mono" style={{ fontSize: '0.82rem' }}>
                  Enter the Focus Laboratory. Activate 40Hz synthesized audio, sever notifications, and finish sprints.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="editorial-card h-100 p-4 text-center">
                <div className="editorial-badge mb-3">STAGE 03</div>
                <h3 className="font-headline fs-4 mb-2">MEASURE</h3>
                <p className="text-secondary font-mono" style={{ fontSize: '0.82rem' }}>
                  Telemetry without distortion. View actual database records of streak counts, exam scores, and focus hours.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="editorial-card h-100 p-4 text-center">
                <div className="editorial-badge mb-3">STAGE 04</div>
                <h3 className="font-headline fs-4 mb-2">TRANSMUTE</h3>
                <p className="text-secondary font-mono" style={{ fontSize: '0.82rem' }}>
                  Document friction in the Deep Journal. Consult the AI Mentor for weak topics. Eliminate limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — AI INTELLIGENCE INTERACTIVE PREVIEW
          ========================================================================= */}
      <section className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="editorial-label">07 // GEMINI MULTI-MODE INTELLECT</span>
              <h2 className="font-headline display-5 text-uppercase fw-bold mt-2">
                SIX REASONING SPECIALIZATIONS
              </h2>
            </div>
            <Link to="/ai-assistant" className="editorial-btn editorial-btn-outline mt-3 mt-md-0">
              <span>LAUNCH FULL CHAT</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="row g-4">
            {/* Mode Switcher Sidebar */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-2">
                {Object.keys(aiModeDemos).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveAiMode(mode)}
                    className="editorial-btn text-start justify-content-start p-3 w-100 transition-smooth"
                    style={{
                      background: activeAiMode === mode ? 'var(--text-primary)' : 'var(--bg-secondary)',
                      color: activeAiMode === mode ? 'var(--bg-primary)' : 'var(--text-primary)',
                      borderColor: activeAiMode === mode ? 'var(--text-primary)' : 'var(--border-color)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <span className="font-headline fw-bold">{mode} MODE</span>
                      <span className="font-mono" style={{ fontSize: '0.72rem' }}>0{Object.keys(aiModeDemos).indexOf(mode) + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Preview Console */}
            <div className="col-lg-8">
              <div className="editorial-card p-4 p-lg-5 h-100" style={{ background: 'var(--bg-secondary)' }}>
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <span className="editorial-badge mb-1">{activeAiMode} PROTOCOL</span>
                    <h3 className="font-headline fs-4 text-light">{aiModeDemos[activeAiMode].title}</h3>
                  </div>
                  <Cpu size={22} className="text-light" />
                </div>

                <div className="mb-4">
                  <div className="editorial-label mb-2">USER INQUIRY</div>
                  <div className="p-3 border font-mono text-light" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-tertiary)', fontSize: '0.85rem' }}>
                    "{aiModeDemos[activeAiMode].samplePrompt}"
                  </div>
                </div>

                <div>
                  <div className="editorial-label mb-2">GEMINI RESPONSE SPECIFICATION</div>
                  <div className="p-3 border font-mono text-secondary" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)', fontSize: '0.85rem', lineHeight: '1.7' }}>
                    {aiModeDemos[activeAiMode].sampleAnswer}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="editorial-label" style={{ color: 'var(--text-muted)' }}>
                    SECURITY: GEMINI KEY PROXIED VIA JAVA REST BACKEND
                  </span>
                  <Link to="/ai-assistant" className="editorial-label text-light text-decoration-none d-flex align-items-center gap-1">
                    TEST THIS MODE <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — NQT LEARNING CENTER SPOTLIGHT
          ========================================================================= */}
      <section className="py-6 py-lg-7 border-bottom" style={{ borderColor: 'var(--border-color)', padding: '5rem 0' }}>
        <div className="container-fluid px-lg-5 px-3">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="editorial-label">08 // NQT CRUCIBLE</span>
              <h2 className="font-headline display-5 text-uppercase fw-bold mt-2 mb-4">
                COMPETITIVE EXAM PREPARATION
              </h2>
              <p className="text-secondary font-mono mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                Engineered specifically for TCS NQT, Infosys DSE, Wipro Elite, and Accenture technical screenings. Features verified previous-year question sets, instant code snippet evaluations, and timed full-length simulations.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="editorial-badge">CORE JAVA OOP</span>
                <span className="editorial-badge">PYTHON DATA STRUCTURES</span>
                <span className="editorial-badge">SQL SUBQUERIES</span>
                <span className="editorial-badge">SPEED APTITUDE</span>
              </div>
              <Link to="/nqt" className="editorial-btn editorial-btn-primary">
                <span>ENTER NQT CRUCIBLE</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="col-lg-7">
              <div className="editorial-card p-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <Terminal size={16} />
                    <span className="editorial-label">LIVE VERIFIED QUESTION // TCS NQT 2024</span>
                  </div>
                  <span className="editorial-badge">INTERMEDIATE</span>
                </div>

                <div className="font-headline fs-5 text-light mb-3">
                  What is the output of the following Java snippet regarding HashMap hash collisions?
                </div>

                <pre className="p-3 border font-mono text-light mb-3" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)', fontSize: '0.82rem' }}>
{`Map<String, Integer> map = new HashMap<>();
map.put(new String("Aa"), 1);
map.put(new String("BB"), 2);
System.out.println(map.size());`}
                </pre>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="p-2 border font-mono" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.8rem', background: 'var(--bg-primary)' }}>
                    A) 1 (second key overwrites the first)
                  </div>
                  <div className="p-2 border font-mono border-light" style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)' }}>
                    B) 2 (both entries stored in the same bucket via separate chaining) ✓
                  </div>
                </div>

                <div className="p-3 border font-mono" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>Crucible Analysis:</strong> "Aa" and "BB" have the exact same hashCode (2112), but String.equals() evaluates to false. Thus, both distinct keys are stored in the same bucket, resulting in size = 2.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — THE MANIFESTO
          ========================================================================= */}
      <section className="py-6 py-lg-7 text-center position-relative overflow-hidden" style={{ padding: '6rem 0' }}>
        <div className="container px-lg-5 px-3">
          <div className="editorial-label mb-3">09 // THE MANIFESTO</div>
          <h2
            className="font-headline text-uppercase fw-bold mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              lineHeight: '1.02',
              letterSpacing: '-0.03em',
            }}
          >
            THERE ARE NO<br />
            UNNECESSARY LIMITS
          </h2>
          <div className="mx-auto" style={{ maxWidth: '680px' }}>
            <p className="font-serif fst-italic quote-editorial mb-4" style={{ fontSize: '1.4rem' }}>
              "The boundary between what is achievable and what is impossible exists only in unexamined assumptions. Eliminate the noise. Execute the protocol."
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/auth" className="editorial-btn editorial-btn-primary py-3 px-5">
                <span>JOIN THE ECOSYSTEM</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
