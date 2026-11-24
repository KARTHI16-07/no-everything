import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Activity, Shield, Clock, CheckCircle2, TrendingUp, Layers, Terminal } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getAnalytics()
      .then(res => {
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: '80px' }}>
        <div className="text-center">
          <div className="spinner-border text-light mb-3" style={{ width: '2rem', height: '2rem' }} role="status"></div>
          <p className="editorial-label">COMPUTING REAL DATABASE TELEMETRY...</p>
        </div>
      </div>
    );
  }

  const tagColors = ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333'];

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">TELEMETRY DECK // PURE EMPIRICAL DATA</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            PERSONAL ANALYTICS & VELOCITY
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Empirical measurements computed strictly from real stored database sessions and completions.
          </p>
        </div>

        <div className="editorial-card py-2 px-3 mt-3 mt-md-0" style={{ background: 'var(--bg-secondary)' }}>
          <span className="editorial-label">OVERALL GROWTH INDEX</span>
          <div className="font-mono fs-4 fw-bold text-light">{data?.overallGrowthIndex || 0}%</div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="row g-3 mb-5">
        <div className="col-lg-3 col-sm-6">
          <div className="editorial-card p-3">
            <span className="editorial-label">TOTAL FOCUS INVESTED</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1 d-flex align-items-center gap-2">
              <Clock size={20} /> {data?.totalFocusHours || 0} <span className="fs-6 text-secondary">HOURS</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="editorial-card p-3">
            <span className="editorial-label">TASKS CONQUERED</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1 d-flex align-items-center gap-2">
              <CheckCircle2 size={20} /> {data?.totalCompletedTasks || 0}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="editorial-card p-3">
            <span className="editorial-label">JOURNAL REFLECTIONS</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1 d-flex align-items-center gap-2">
              <Layers size={20} /> {data?.totalJournalEntries || 0}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="editorial-card p-3">
            <span className="editorial-label">NQT MOCK EXAMS</span>
            <div className="font-mono fs-2 fw-bold text-light mt-1 d-flex align-items-center gap-2">
              <Terminal size={20} /> {data?.totalNqtTestsTaken || 0} <span className="fs-6 text-secondary">({data?.nqtAverageScore || 0}% AVG)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Weekly Productivity Velocity (Area Chart) */}
      <div className="editorial-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="editorial-label">VELOCITY TREND</span>
            <h3 className="font-headline fs-5 text-light mb-0">WEEKLY COMPOSITE PRODUCTIVITY</h3>
          </div>
          <span className="editorial-badge">7-DAY TRAJECTORY</span>
        </div>

        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.weeklyProductivity || []}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#666666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#666666" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '11px', fontFamily: 'monospace' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="productivityScore" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Habit Consistency & Focus Tag Distribution */}
      <div className="row g-4">
        {/* Habit Consistency Bar Chart */}
        <div className="col-lg-7">
          <div className="editorial-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">INVARIANT CONSISTENCY</span>
                <h3 className="font-headline fs-5 text-light mb-0">HABIT COMPLETION RATE (%)</h3>
              </div>
              <span className="editorial-badge">30-DAY SCOPE</span>
            </div>

            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.habitConsistency || []}>
                  <XAxis dataKey="habitName" stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '11px', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="completionRate" fill="#FFFFFF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Focus Time by Domain */}
        <div className="col-lg-5">
          <div className="editorial-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="editorial-label">DOMAIN ALLOCATION</span>
                <h3 className="font-headline fs-5 text-light mb-0">FOCUS DISTRIBUTION</h3>
              </div>
              <span className="editorial-badge">DEEP WORK TAGS</span>
            </div>

            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.focusDistributionByTag || []}
                    dataKey="minutes"
                    nameKey="tag"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    stroke="#050505"
                    strokeWidth={2}
                  >
                    {(data?.focusDistributionByTag || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={tagColors[index % tagColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #333', fontSize: '11px', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 pt-2">
              {(data?.focusDistributionByTag || []).map((t, idx) => (
                <div key={t.tag} className="d-flex align-items-center gap-1 font-mono" style={{ fontSize: '0.72rem' }}>
                  <div style={{ width: '8px', height: '8px', background: tagColors[idx % tagColors.length] }} />
                  <span className="text-secondary">{t.tag} ({t.minutes}m)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
