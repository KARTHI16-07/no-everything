import React, { useState, useEffect, useRef } from 'react';
import { nqtApi } from '../services/api';
import {
  Terminal,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Play,
  Bookmark,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NqtCenter() {
  const [activeTab, setActiveTab] = useState('PRACTICE'); // 'PRACTICE', 'MOCK_TEST', 'PYQ', 'HISTORY'
  const [topic, setTopic] = useState('JAVA');
  const [difficulty, setDifficulty] = useState('ALL');
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Practice state
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock Test State
  const [testActive, setTestActive] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // questionId -> optionKey
  const [markedForReview, setMarkedForReview] = useState({}); // questionId -> bool
  const [testTimeLeft, setTestTimeLeft] = useState(15 * 60); // 15 mins
  const [testResult, setTestResult] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // History state
  const [historyList, setHistoryList] = useState([]);

  const testTimerRef = useRef(null);

  const topics = [
    { key: 'JAVA', label: 'CORE JAVA' },
    { key: 'PYTHON', label: 'PYTHON' },
    { key: 'SQL', label: 'SQL & DB' },
    { key: 'APTITUDE', label: 'QUANTITATIVE APTITUDE' },
    { key: 'LOGICAL', label: 'LOGICAL REASONING' },
    { key: 'TECHNICAL', label: 'OS & ARCHITECTURE' },
  ];

  useEffect(() => {
    if (activeTab === 'PRACTICE') {
      loadPracticeQuestions();
    } else if (activeTab === 'PYQ') {
      loadPyqQuestions();
    } else if (activeTab === 'HISTORY') {
      loadHistory();
    }
  }, [activeTab, topic, difficulty]);

  // Handle Mock Test Countdown Timer
  useEffect(() => {
    if (testActive) {
      testTimerRef.current = setInterval(() => {
        setTestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(testTimerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    }
    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [testActive, userAnswers]);

  const loadPracticeQuestions = () => {
    setLoading(true);
    nqtApi.getPracticeQuestions({
      topic,
      difficulty: difficulty !== 'ALL' ? difficulty : null,
      previousYear: false
    })
      .then(res => {
        setPracticeQuestions(res.data.data || []);
        setCurrentPracticeIndex(0);
        setSelectedPracticeOption(null);
        setShowExplanation(false);
      })
      .finally(() => setLoading(false));
  };

  const loadPyqQuestions = () => {
    setLoading(true);
    nqtApi.getPracticeQuestions({
      topic: topic !== 'ALL' ? topic : null,
      previousYear: true
    })
      .then(res => {
        setPracticeQuestions(res.data.data || []);
        setCurrentPracticeIndex(0);
        setSelectedPracticeOption(null);
        setShowExplanation(false);
      })
      .finally(() => setLoading(false));
  };

  const loadHistory = () => {
    setLoading(true);
    nqtApi.getHistory()
      .then(res => setHistoryList(res.data.data || []))
      .finally(() => setLoading(false));
  };

  const handleStartMockTest = () => {
    setLoading(true);
    setTestResult(null);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentTestIndex(0);
    setTestTimeLeft(15 * 60);

    nqtApi.getMockTest(topic, 10)
      .then(res => {
        setTestQuestions(res.data.data || []);
        setTestActive(true);
      })
      .finally(() => setLoading(false));
  };

  const handleSelectTestAnswer = (qId, optionKey) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const handleToggleReview = (qId) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = () => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
    setSubmittingTest(true);

    const timeSpent = (15 * 60) - testTimeLeft;

    nqtApi.submitTest({
      testTitle: `${topic} Crucible Simulation`,
      topic,
      timeTakenSeconds: timeSpent,
      answers: userAnswers
    })
      .then(res => {
        setTestResult(res.data.data);
        setTestActive(false);
        try {
          if (res.data.data.passed) {
            confetti({ particleCount: 80, spread: 70 });
          }
        } catch (e) {}
      })
      .finally(() => setSubmittingTest(false));
  };

  const currentQ = practiceQuestions[currentPracticeIndex];
  const currentTestQ = testQuestions[currentTestIndex];

  const formatTestTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">COMPETITIVE EXAMINATION ENGINE // TCS NQT CRUCIBLE</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            NQT LEARNING & PREPARATION CENTER
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Verified topic-wise technical preparation, previous-year question archives, and timed mock simulation arenas.
          </p>
        </div>

        {!testActive && (
          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0 font-mono">
            <button
              onClick={() => setActiveTab('PRACTICE')}
              className={`editorial-btn ${activeTab === 'PRACTICE' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
            >
              PRACTICE DRILLS
            </button>
            <button
              onClick={() => setActiveTab('MOCK_TEST')}
              className={`editorial-btn ${activeTab === 'MOCK_TEST' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
            >
              MOCK TEST ARENA
            </button>
            <button
              onClick={() => setActiveTab('PYQ')}
              className={`editorial-btn ${activeTab === 'PYQ' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
            >
              VERIFIED PYQS
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`editorial-btn ${activeTab === 'HISTORY' ? 'editorial-btn-primary' : 'editorial-btn-outline'}`}
            >
              PAST EXAMS
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          TAB 1 & 3: PRACTICE DRILLS / VERIFIED PYQs
          ------------------------------------------------------------- */}
      {!testActive && (activeTab === 'PRACTICE' || activeTab === 'PYQ') && (
        <div>
          {/* Topic Selector Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4 p-3 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            {topics.map(t => (
              <button
                key={t.key}
                onClick={() => setTopic(t.key)}
                className={`editorial-badge btn ${topic === t.key ? 'bg-light text-dark' : ''}`}
                style={{ cursor: 'pointer', padding: '0.5rem 0.9rem' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {currentQ ? (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="editorial-card p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="editorial-badge">{currentQ.topic}</span>
                      <span className="editorial-badge">{currentQ.difficulty}</span>
                      {currentQ.previousYear && (
                        <span className="editorial-badge border-light text-light">
                          {currentQ.examSource} {currentQ.examYear}
                        </span>
                      )}
                    </div>
                    <span className="editorial-label">QUESTION {currentPracticeIndex + 1} OF {practiceQuestions.length}</span>
                  </div>

                  <h3 className="font-headline fs-4 text-light mb-4">{currentQ.questionText}</h3>

                  {currentQ.codeSnippet && (
                    <pre className="p-3 border font-mono text-light mb-4" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)', fontSize: '0.85rem' }}>
                      {currentQ.codeSnippet}
                    </pre>
                  )}

                  {/* Options */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    {currentQ.options && currentQ.options.map(opt => {
                      const isSelected = selectedPracticeOption === opt.optionKey;
                      const isCorrect = opt.isCorrect;
                      let borderColor = 'var(--border-subtle)';
                      let bg = 'var(--bg-secondary)';

                      if (showExplanation) {
                        if (isCorrect) {
                          borderColor = '#FFFFFF';
                          bg = 'rgba(255,255,255,0.08)';
                        } else if (isSelected && !isCorrect) {
                          borderColor = 'var(--border-color)';
                          bg = 'var(--bg-tertiary)';
                        }
                      } else if (isSelected) {
                        borderColor = '#FFFFFF';
                        bg = 'var(--bg-tertiary)';
                      }

                      return (
                        <div
                          key={opt.optionKey}
                          onClick={() => {
                            if (!showExplanation) setSelectedPracticeOption(opt.optionKey);
                          }}
                          className="d-flex align-items-center gap-3 p-3 border transition-smooth"
                          style={{
                            borderColor,
                            background: bg,
                            cursor: showExplanation ? 'default' : 'pointer',
                          }}
                        >
                          <div
                            className="font-mono fw-bold d-flex align-items-center justify-content-center"
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid var(--border-color)',
                              background: isSelected ? 'var(--text-primary)' : 'transparent',
                              color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                            }}
                          >
                            {opt.optionKey}
                          </div>
                          <span className="font-mono text-light" style={{ fontSize: '0.88rem' }}>
                            {opt.optionText}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => {
                          if (currentPracticeIndex > 0) {
                            setCurrentPracticeIndex(prev => prev - 1);
                            setSelectedPracticeOption(null);
                            setShowExplanation(false);
                          }
                        }}
                        disabled={currentPracticeIndex === 0}
                        className="editorial-btn editorial-btn-outline py-2 px-3"
                      >
                        <ChevronLeft size={16} /> PREV
                      </button>
                      <button
                        onClick={() => {
                          if (currentPracticeIndex < practiceQuestions.length - 1) {
                            setCurrentPracticeIndex(prev => prev + 1);
                            setSelectedPracticeOption(null);
                            setShowExplanation(false);
                          }
                        }}
                        disabled={currentPracticeIndex === practiceQuestions.length - 1}
                        className="editorial-btn editorial-btn-outline py-2 px-3"
                      >
                        NEXT <ChevronRight size={16} />
                      </button>
                    </div>

                    {!showExplanation && selectedPracticeOption && (
                      <button
                        onClick={() => setShowExplanation(true)}
                        className="editorial-btn editorial-btn-primary py-2 px-4"
                      >
                        VERIFY SOLUTION
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Explanation & Insights */}
              <div className="col-lg-4">
                <div className="editorial-card p-4 h-100" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="editorial-label mb-2 d-block">CRUCIBLE ARCHITECTURAL EXPLANATION</span>
                  {showExplanation ? (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <CheckCircle2 size={18} className="text-light" />
                        <span className="font-headline fw-bold text-light">VERIFIED CRITERIA</span>
                      </div>
                      <p className="font-mono text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.7' }}>
                        {currentQ.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center font-mono text-secondary py-5">
                      <HelpCircle size={32} className="mb-3 text-muted" />
                      <div>Select an answer and click "VERIFY SOLUTION" to view deep technical rationale.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="editorial-card p-5 text-center font-mono text-secondary">
              No questions found for the selected topic filter.
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: MOCK TEST ARENA (TIMED SIMULATION)
          ------------------------------------------------------------- */}
      {activeTab === 'MOCK_TEST' && !testActive && !testResult && (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="editorial-card p-5 text-center" style={{ background: 'var(--bg-secondary)' }}>
              <Terminal size={40} className="mb-3 text-light" />
              <span className="editorial-label">NQT STANDARDIZED CRUCIBLE</span>
              <h2 className="font-headline fs-2 fw-bold text-light my-2">10-QUESTION TIMED ARENA</h2>
              <p className="font-mono text-secondary mb-4" style={{ fontSize: '0.85rem' }}>
                15 minutes countdown. Question navigation palette, mark for review capability, and automated scoring breakdown.
              </p>

              <div className="row g-3 mb-4 text-start font-mono" style={{ fontSize: '0.8rem' }}>
                <div className="col-6 p-2 border" style={{ borderColor: 'var(--border-subtle)' }}>
                  QUESTIONS: 10
                </div>
                <div className="col-6 p-2 border" style={{ borderColor: 'var(--border-subtle)' }}>
                  TIME: 15 MINUTES
                </div>
                <div className="col-6 p-2 border" style={{ borderColor: 'var(--border-subtle)' }}>
                  PASS CRITERIA: 60%+
                </div>
                <div className="col-6 p-2 border" style={{ borderColor: 'var(--border-subtle)' }}>
                  TOPIC: {topic}
                </div>
              </div>

              <button
                onClick={handleStartMockTest}
                className="editorial-btn editorial-btn-primary w-100 py-3"
              >
                <Play size={16} />
                <span>INITIATE CRUCIBLE TEST</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE MOCK TEST SIMULATION */}
      {testActive && currentTestQ && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="editorial-card p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="editorial-badge">QUESTION {currentTestIndex + 1} OF {testQuestions.length}</span>
                  <span className="editorial-badge">{currentTestQ.difficulty}</span>
                </div>
                <div className="font-mono fw-bold fs-5 text-light d-flex align-items-center gap-2">
                  <Clock size={16} />
                  <span>{formatTestTime(testTimeLeft)}</span>
                </div>
              </div>

              <h3 className="font-headline fs-4 text-light mb-4">{currentTestQ.questionText}</h3>

              {currentTestQ.codeSnippet && (
                <pre className="p-3 border font-mono text-light mb-4" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)', fontSize: '0.85rem' }}>
                  {currentTestQ.codeSnippet}
                </pre>
              )}

              {/* Options */}
              <div className="d-flex flex-column gap-3 mb-4">
                {currentTestQ.options && currentTestQ.options.map(opt => {
                  const isSelected = userAnswers[currentTestQ.id] === opt.optionKey;
                  return (
                    <div
                      key={opt.optionKey}
                      onClick={() => handleSelectTestAnswer(currentTestQ.id, opt.optionKey)}
                      className="d-flex align-items-center gap-3 p-3 border transition-smooth cursor-pointer"
                      style={{
                        borderColor: isSelected ? '#FFFFFF' : 'var(--border-subtle)',
                        background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="font-mono fw-bold d-flex align-items-center justify-content-center"
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid var(--border-color)',
                          background: isSelected ? 'var(--text-primary)' : 'transparent',
                          color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                        }}
                      >
                        {opt.optionKey}
                      </div>
                      <span className="font-mono text-light" style={{ fontSize: '0.88rem' }}>
                        {opt.optionText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setCurrentTestIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentTestIndex === 0}
                    className="editorial-btn editorial-btn-outline py-2 px-3"
                  >
                    PREV
                  </button>
                  <button
                    onClick={() => setCurrentTestIndex(prev => Math.min(testQuestions.length - 1, prev + 1))}
                    disabled={currentTestIndex === testQuestions.length - 1}
                    className="editorial-btn editorial-btn-outline py-2 px-3"
                  >
                    NEXT
                  </button>
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleToggleReview(currentTestQ.id)}
                    className={`editorial-btn ${markedForReview[currentTestQ.id] ? 'editorial-btn-primary' : 'editorial-btn-outline'} py-2 px-3`}
                  >
                    <Bookmark size={14} />
                    <span>{markedForReview[currentTestQ.id] ? 'MARKED' : 'MARK FOR REVIEW'}</span>
                  </button>
                  <button
                    onClick={handleSubmitTest}
                    disabled={submittingTest}
                    className="editorial-btn editorial-btn-primary py-2 px-4"
                  >
                    {submittingTest ? 'SCORING...' : 'FINISH & SCORE'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette Matrix */}
          <div className="col-lg-4">
            <div className="editorial-card p-4">
              <span className="editorial-label mb-3 d-block">QUESTION PALETTE</span>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {testQuestions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isMarked = !!markedForReview[q.id];
                  const isCurrent = currentTestIndex === idx;

                  let border = '1px solid var(--border-subtle)';
                  let bg = 'var(--bg-secondary)';
                  let color = 'var(--text-secondary)';

                  if (isCurrent) {
                    border = '1px solid #FFFFFF';
                  }
                  if (isAnswered) {
                    bg = 'var(--text-primary)';
                    color = 'var(--bg-primary)';
                  }
                  if (isMarked) {
                    border = '1px dashed #FFFFFF';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentTestIndex(idx)}
                      className="btn font-mono fw-bold"
                      style={{
                        width: '38px',
                        height: '38px',
                        padding: 0,
                        border,
                        background: bg,
                        color,
                        borderRadius: 0,
                        fontSize: '0.85rem',
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="d-flex flex-column gap-2 font-mono pt-3 border-top" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.72rem' }}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', background: 'var(--text-primary)' }} />
                  <span>ANSWERED ({Object.keys(userAnswers).length})</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', border: '1px dashed #FFFFFF' }} />
                  <span>MARKED FOR REVIEW ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }} />
                  <span>UNATTEMPTED ({testQuestions.length - Object.keys(userAnswers).length})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEST RESULT REPORT */}
      {testResult && (
        <div className="editorial-card p-4 p-md-5 mb-5">
          <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <span className="editorial-label">EXAMINATION SCORECARD // TELEMETRY</span>
              <h2 className="font-headline fs-2 fw-bold text-light mb-0">{testResult.testTitle}</h2>
            </div>
            <button
              onClick={() => { setTestResult(null); setActiveTab('MOCK_TEST'); }}
              className="editorial-btn editorial-btn-outline"
            >
              <RotateCcw size={14} />
              <span>RETAKE SIMULATION</span>
            </button>
          </div>

          <div className="row g-4 mb-5 text-center font-mono">
            <div className="col-md-3">
              <div className="p-3 border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="editorial-label">RAW SCORE</div>
                <div className="fs-2 fw-bold text-light mt-1">{testResult.score} / {testResult.totalMarks}</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="editorial-label">ACCURACY</div>
                <div className="fs-2 fw-bold text-light mt-1">{Math.round(testResult.percentage)}%</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="editorial-label">DURATION</div>
                <div className="fs-2 fw-bold text-light mt-1">{Math.round(testResult.timeTakenSeconds / 60)} MINS</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="editorial-label">VERDICT</div>
                <div className={`fs-2 fw-bold mt-1 ${testResult.passed ? 'text-light' : 'text-secondary'}`}>
                  {testResult.passed ? 'QUALIFIED' : 'NEEDS REVISION'}
                </div>
              </div>
            </div>
          </div>

          {/* Granular Question Breakdown */}
          <span className="editorial-label mb-3 d-block">DETAILED CRUCIBLE QUESTION REVIEWS</span>
          <div className="d-flex flex-column gap-4">
            {testResult.questionReviews && testResult.questionReviews.map((rev, i) => (
              <div key={i} className="p-4 border" style={{ borderColor: rev.correct ? '#FFFFFF' : 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2 font-mono">
                  <span className="fw-bold text-light">QUESTION {i + 1}</span>
                  <span className={`editorial-badge ${rev.correct ? 'border-light text-light' : ''}`}>
                    {rev.correct ? 'CORRECT (+1)' : 'INCORRECT (0)'}
                  </span>
                </div>
                <div className="font-headline fs-5 text-light mb-3">{rev.questionText}</div>
                {rev.codeSnippet && (
                  <pre className="p-2 border font-mono text-light mb-3" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)', fontSize: '0.8rem' }}>
                    {rev.codeSnippet}
                  </pre>
                )}
                <div className="font-mono mb-2" style={{ fontSize: '0.82rem' }}>
                  <span className="text-secondary">Your Selection: </span>
                  <strong className="text-light">{rev.selectedOption || 'None'}</strong>
                  <span className="text-secondary ms-4">Correct Option: </span>
                  <strong className="text-light">{rev.correctOption}</strong>
                </div>
                <div className="p-3 border font-mono text-secondary mt-2" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-primary)', fontSize: '0.8rem' }}>
                  <strong>Crucible Analysis:</strong> {rev.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: PAST TEST HISTORY
          ------------------------------------------------------------- */}
      {!testActive && activeTab === 'HISTORY' && (
        <div className="editorial-card p-4">
          <span className="editorial-label mb-3 d-block">SIMULATION ARCHIVE</span>
          {historyList.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {historyList.map(h => (
                <div key={h.id} className="p-3 border d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                  <div>
                    <div className="font-headline fs-5 text-light fw-bold">{h.testTitle}</div>
                    <div className="editorial-label mt-1">
                      {h.topic} // {new Date(h.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-end font-mono">
                    <div className="fs-5 fw-bold text-light">{h.score} / {h.totalMarks} ({Math.round(h.percentage)}%)</div>
                    <span className="editorial-badge">{h.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center font-mono text-secondary">
              No previous test attempts recorded. Take your first timed mock exam.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
