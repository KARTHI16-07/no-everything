import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, habitsApi, tasksApi } from '../services/api';
import {
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
  Shield,
  Plus,
  Play,
  Activity,
  Award,
  BookOpen,
  Terminal,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = () => {
    dashboardApi.getSummary()
      .then(res => {
        if (res.data && res.data.data) {
          setSummary(res.data.data);
        }
      })
      .catch(err => {
        setError('Failed to load dashboard telemetry.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleHabit = (habitId) => {
    habitsApi.toggle(habitId)
      .then(() => fetchDashboardData())
      .catch(() => {});
  };

  const handleToggleTask = (taskId) => {
    tasksApi.toggle(taskId)
      .then(() => fetchDashboardData())
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: '80px' }}>
        <div className="text-center">
          <div className="spinner-border text-light mb-3" style={{ width: '2rem', height: '2rem' }} role="status"></div>
          <p className="editorial-label">CALIBRATING PERSONAL TELEMETRY...</p>
        </div>
      </div>
    );
  }

  // Transform weekly focus minutes map for Recharts
  const focusChartData = summary?.weeklyFocusMinutes
    ? Object.entries(summary.weeklyFocusMinutes).map(([day, minutes]) => ({ day, minutes }))
    : [];

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">OPERATIONAL COCKPIT</span>
          <h1 className="font-headline display-6 fw-bold mt-1 mb-1 text-uppercase">
            {summary?.welcomeMessage || 'COMMAND CENTER'}
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.82rem' }}>
            {summary?.currentDate}
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/focus" className="editorial-btn editorial-btn-primary py-2 px-3">
            <Play size={14} />
            <span>START SPRINT</span>
          </Link>
          <Link to="/journal" className="editorial-btn editorial-btn-outline py-2 px-3">
            <BookOpen size={14} />
            <span>NEW ENTRY</span>
          </Link>
        </div>
      </div>

      {/* Daily Motivational Quote Card */}
      {summary?.dailyQuote && (
        <div className="editorial-card p-4 mb-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="editorial-badge">DAILY INSPIRATION // {summary.dailyQuote.category}</span>
            <Link to="/quotes" className="editorial-label text-secondary text-decoration-none hover-white">
              EXPLORE ALL →
            </Link>
          </div>
          <blockquote className="font-serif quote-editorial mb-2" style={{ fontSize: '1.25rem' }}>
            "{summary.dailyQuote.quoteText}"
          </blockquote>
          <div className="d-flex justify-content-between align-items-center font-mono text-secondary" style={{ fontSize: '0.78rem' }}>
            <span>— {summary.dailyQuote.author}</span>
            <span className="d-none d-md-inline">{summary.dailyQuote.explanation}</span>
          </div>
        </div>
      )}

      {/* KPI Matrix Deck (Derived directly from DB) */}
      <div className="row g-3 mb-4">
        {/* Readiness Index */}
        <div className="col-xl-3 col-sm-6">
          <div className="editorial-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="editorial-label">READINESS INDEX</span>
              <Shield size={16} />
            </div>
            <div className="font-mono fs-2 fw-bold text-light mb-1">
              {summary?.readinessIndex || 0}%
            </div>
            <div className="progress rounded-0" style={{ height: '4px', background: 'var(--border-subtle)' }}>
              <div
                className="progress-bar bg-light"
                role="progressbar"
                style={{ width: `${summary?.readinessIndex || 0}%` }}
              />
            </div>
            <div className="editorial-label mt-2" style={{ fontSize: '0.65rem' }}>
              COMPOSITE DAILY DISCIPLINE
            </div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="col-xl-3 col-sm-6">
          <div className="editorial-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="editorial-label">CONSECUTIVE STREAK</span>
              <Flame size={16} />
            </div>
            <div className="font-mono fs-2 fw-bold text-light mb-1">
              {summary?.currentStreakDays || 0} <span className="fs-6 text-secondary">DAYS</span>
            </div>
            <div className="editorial-label mt-2" style={{ fontSize: '0.7rem' }}>
              ALL-TIME BEST : {summary?.bestStreakDays || 0} DAYS
            </div>
          </div>
        </div>

        {/* Focus Hours Today */}
        <div className="col-xl-3 col-sm-6">
          <div className="editorial-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="editorial-label">FOCUS TIME TODAY</span>
              <Clock size={16} />
            </div>
            <div className="font-mono fs-2 fw-bold text-light mb-1">
              {summary?.focusMinutesToday || 0} <span className="fs-6 text-secondary">/ {summary?.focusGoalMinutes || 100} MINS</span>
            </div>
            <div className="progress rounded-0" style={{ height: '4px', background: 'var(--border-subtle)' }}>
              <div
                className="progress-bar bg-light"
                role="progressbar"
                style={{ width: `${Math.min(100, ((summary?.focusMinutesToday || 0) / (summary?.focusGoalMinutes || 100)) * 100)}%` }}
              />
            </div>
            <div className="editorial-label mt-2" style={{ fontSize: '0.65rem' }}>
              DEEP WORK DEDICATION
            </div>
          </div>
        </div>

        {/* Habit Completion */}
        <div className="col-xl-3 col-sm-6">
          <div className="editorial-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="editorial-label">HABITS CHECKED</span>
              <CheckCircle2 size={16} />
            </div>
            <div className="font-mono fs-2 fw-bold text-light mb-1">
              {summary?.habitsCompletedToday || 0} <span className="fs-6 text-secondary">/ {summary?.totalHabitsToday || 0}</span>
            </div>
            <div className="editorial-label mt-2" style={{ fontSize: '0.7rem' }}>
              TASKS TODAY : {summary?.completedTasksToday || 0} COMPLETED
            </div>
          </div>
        </div>
      </div>

      {/* Main Operational Split */}
      <div className="row g-4">
        {/* Left Column: Habits & Tasks */}
        <div className="col-lg-7">
          {/* Active Habit Checklist */}
          <div className="editorial-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">HABIT MATRIX</span>
                <h3 className="font-headline fs-5 text-light mb-0">TODAY'S INVARIANTS</h3>
              </div>
              <Link to="/habits" className="editorial-btn editorial-btn-ghost p-1 font-mono" style={{ fontSize: '0.75rem' }}>
                MANAGE HABITS →
              </Link>
            </div>

            {summary?.activeHabits && summary.activeHabits.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {summary.activeHabits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className="d-flex align-items-center justify-content-between p-3 border transition-smooth"
                    style={{
                      borderColor: habit.completedToday ? 'var(--border-color)' : 'var(--border-subtle)',
                      background: habit.completedToday ? 'var(--bg-secondary)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {habit.completedToday ? (
                        <CheckCircle2 size={18} className="text-light" />
                      ) : (
                        <Circle size={18} className="text-muted" />
                      )}
                      <div>
                        <div
                          className="font-mono fw-medium"
                          style={{
                            fontSize: '0.88rem',
                            textDecoration: habit.completedToday ? 'line-through' : 'none',
                            color: habit.completedToday ? 'var(--text-secondary)' : 'var(--text-primary)',
                          }}
                        >
                          {habit.title}
                        </div>
                        <div className="editorial-label" style={{ fontSize: '0.65rem' }}>
                          STREAK: {habit.streakCount} DAYS // {habit.category}
                        </div>
                      </div>
                    </div>
                    <span className="editorial-badge" style={{ fontSize: '0.65rem' }}>
                      {habit.completedToday ? 'LOGGED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border font-mono text-secondary" style={{ borderColor: 'var(--border-subtle)' }}>
                No active habits defined. <Link to="/habits" className="text-light text-decoration-underline">Create your first invariant.</Link>
              </div>
            )}
          </div>

          {/* Upcoming & Critical Tasks */}
          <div className="editorial-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">TASK RADAR</span>
                <h3 className="font-headline fs-5 text-light mb-0">UPCOMING EXECUTION</h3>
              </div>
              <Link to="/tasks" className="editorial-btn editorial-btn-ghost p-1 font-mono" style={{ fontSize: '0.75rem' }}>
                VIEW ALL TASKS →
              </Link>
            </div>

            {summary?.upcomingTasks && summary.upcomingTasks.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {summary.upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="d-flex align-items-center justify-content-between p-3 border"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="btn p-0 text-light"
                      >
                        <Circle size={17} className="text-muted" />
                      </button>
                      <div>
                        <div className="font-mono text-light" style={{ fontSize: '0.88rem' }}>{task.title}</div>
                        <div className="editorial-label" style={{ fontSize: '0.65rem' }}>
                          DUE: {task.dueDate} // PRIORITY: {task.priority} // {task.category}
                        </div>
                      </div>
                    </div>
                    <span
                      className="editorial-badge"
                      style={{
                        borderColor: task.priority === 'HIGH' ? '#FFFFFF' : 'var(--border-color)',
                        color: task.priority === 'HIGH' ? '#FFFFFF' : 'var(--text-secondary)'
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border font-mono text-secondary" style={{ borderColor: 'var(--border-subtle)' }}>
                All pending tasks cleared. <Link to="/tasks" className="text-light text-decoration-underline">Queue new task.</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weekly Focus Trends & Activity Stream */}
        <div className="col-lg-5">
          {/* Weekly Focus Time Chart */}
          <div className="editorial-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">WEEKLY RHYTHM</span>
                <h3 className="font-headline fs-5 text-light mb-0">FOCUS MINUTES</h3>
              </div>
              <Link to="/analytics" className="editorial-label text-secondary text-decoration-none hover-white">
                ANALYTICS →
              </Link>
            </div>

            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusChartData}>
                  <XAxis dataKey="day" stroke="#666666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '11px', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="minutes" fill="#FFFFFF" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="editorial-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">ACTIVITY AUDIT</span>
                <h3 className="font-headline fs-5 text-light mb-0">CHRONOLOGICAL LOG</h3>
              </div>
              <Activity size={16} />
            </div>

            {summary?.recentActivities && summary.recentActivities.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {summary.recentActivities.map((act) => (
                  <div key={act.id} className="pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="d-flex justify-content-between align-items-center font-mono" style={{ fontSize: '0.8rem' }}>
                      <span className="text-light fw-medium">{act.title}</span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{act.timestamp}</span>
                    </div>
                    <div className="editorial-label mt-1" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                      {act.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center font-mono text-secondary" style={{ fontSize: '0.8rem' }}>
                Telemetry logging active. Complete sprints or tasks to populate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
