import React, { useState, useEffect } from 'react';
import { tasksApi, goalsApi } from '../services/api';
import { Plus, CheckCircle2, Circle, Trash2, Calendar, Target, CheckSquare, Flag, Clock, Layers } from 'lucide-react';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('TASKS'); // 'TASKS' or 'GOALS'
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterCompleted, setFilterCompleted] = useState(false);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskCategory, setTaskCategory] = useState('STUDY');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskMinutes, setTaskMinutes] = useState(45);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState('CAREER');
  const [goalType, setGoalType] = useState('LONG_TERM');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [milestoneInputs, setMilestoneInputs] = useState(['', '', '']);

  useEffect(() => {
    loadData();
  }, [filterPriority, filterCategory, filterCompleted, activeTab]);

  const loadData = () => {
    setLoading(true);
    if (activeTab === 'TASKS') {
      tasksApi.getAll({
        completed: filterCompleted,
        priority: filterPriority !== 'ALL' ? filterPriority : null,
        category: filterCategory !== 'ALL' ? filterCategory : null,
      })
        .then(res => setTasks(res.data.data || []))
        .finally(() => setLoading(false));
    } else {
      goalsApi.getAll()
        .then(res => setGoals(res.data.data || []))
        .finally(() => setLoading(false));
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    tasksApi.create({
      title: taskTitle.trim(),
      description: taskDesc,
      priority: taskPriority,
      category: taskCategory,
      dueDate: taskDueDate,
      estimatedMinutes: Number(taskMinutes)
    })
      .then(() => {
        setShowTaskModal(false);
        setTaskTitle('');
        setTaskDesc('');
        loadData();
      });
  };

  const handleToggleTask = (id) => {
    tasksApi.toggle(id).then(() => loadData());
  };

  const handleDeleteTask = (id) => {
    tasksApi.delete(id).then(() => loadData());
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const milestones = milestoneInputs.filter(m => m.trim().length > 0);
    goalsApi.create({
      title: goalTitle.trim(),
      description: goalDesc,
      category: goalCategory,
      type: goalType,
      targetDate: goalTargetDate || null,
      milestones
    })
      .then(() => {
        setShowGoalModal(false);
        setGoalTitle('');
        setGoalDesc('');
        setMilestoneInputs(['', '', '']);
        loadData();
      });
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    goalsApi.toggleMilestone(goalId, milestoneId).then(() => loadData());
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Delete this goal and all associated milestones?')) {
      goalsApi.delete(id).then(() => loadData());
    }
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">EXECUTION ENGINE // VELOCITY</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            TASK & STRATEGIC GOALS
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Transforming ambitious long-term visions into granular daily execution blocks.
          </p>
        </div>

        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button
            onClick={() => setShowTaskModal(true)}
            className="editorial-btn editorial-btn-primary"
          >
            <Plus size={15} />
            <span>NEW TASK</span>
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="editorial-btn editorial-btn-outline"
          >
            <Target size={15} />
            <span>NEW STRATEGIC GOAL</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-4 border-bottom mb-4" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setActiveTab('TASKS')}
          className="btn font-headline fw-bold pb-3 px-0 position-relative transition-smooth"
          style={{
            fontSize: '1rem',
            color: activeTab === 'TASKS' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'TASKS' ? '2px solid var(--text-primary)' : '2px solid transparent',
            borderRadius: 0,
          }}
        >
          TASK QUEUE ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('GOALS')}
          className="btn font-headline fw-bold pb-3 px-0 position-relative transition-smooth"
          style={{
            fontSize: '1rem',
            color: activeTab === 'GOALS' ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'GOALS' ? '2px solid var(--text-primary)' : '2px solid transparent',
            borderRadius: 0,
          }}
        >
          STRATEGIC GOALS & MILESTONES ({goals.length})
        </button>
      </div>

      {/* TAB 1: TASKS */}
      {activeTab === 'TASKS' && (
        <div>
          {/* Filters Bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="editorial-label me-2">PRIORITY:</span>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`editorial-badge btn ${filterPriority === p ? 'bg-light text-dark' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="d-flex gap-2 align-items-center">
              <span className="editorial-label me-2">STATUS:</span>
              <button
                onClick={() => setFilterCompleted(!filterCompleted)}
                className={`editorial-badge btn ${filterCompleted ? 'bg-light text-dark' : ''}`}
              >
                {filterCompleted ? 'COMPLETED ONLY' : 'PENDING ONLY'}
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="d-flex flex-column gap-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="editorial-card p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                style={{
                  background: task.completed ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  opacity: task.completed ? 0.7 : 1,
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="btn p-0 text-light mt-1"
                  >
                    {task.completed ? <CheckCircle2 size={20} className="text-light" /> : <Circle size={20} className="text-muted" />}
                  </button>
                  <div>
                    <div
                      className="font-headline fs-5 text-light fw-bold"
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="font-mono text-secondary mb-2" style={{ fontSize: '0.82rem' }}>
                        {task.description}
                      </p>
                    )}
                    <div className="d-flex flex-wrap gap-2 align-items-center font-mono" style={{ fontSize: '0.72rem' }}>
                      <span className="editorial-badge">{task.category}</span>
                      <span className="editorial-label d-flex align-items-center gap-1">
                        <Calendar size={12} /> DUE: {task.dueDate}
                      </span>
                      <span className="editorial-label d-flex align-items-center gap-1">
                        <Clock size={12} /> {task.estimatedMinutes} MINS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 align-self-end align-self-md-center">
                  <span
                    className="editorial-badge"
                    style={{
                      borderColor: task.priority === 'HIGH' ? '#FFFFFF' : 'var(--border-color)',
                      color: task.priority === 'HIGH' ? '#FFFFFF' : 'var(--text-secondary)'
                    }}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn p-1 text-secondary hover-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="editorial-card p-5 text-center font-mono text-secondary">
                No tasks match current filter parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STRATEGIC GOALS */}
      {activeTab === 'GOALS' && (
        <div className="row g-4">
          {goals.map(goal => (
            <div key={goal.id} className="col-lg-6">
              <div className="editorial-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="editorial-badge">{goal.type} // {goal.category}</span>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="btn p-0 text-secondary hover-white">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="font-headline fs-4 text-light fw-bold mb-2">{goal.title}</h3>
                  {goal.description && (
                    <p className="font-mono text-secondary mb-3" style={{ fontSize: '0.82rem' }}>{goal.description}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between font-mono mb-1" style={{ fontSize: '0.75rem' }}>
                      <span className="editorial-label">PROGRESS</span>
                      <span className="text-light fw-bold">{goal.progressPercentage}%</span>
                    </div>
                    <div className="progress rounded-0" style={{ height: '6px', background: 'var(--border-subtle)' }}>
                      <div
                        className="progress-bar bg-light"
                        role="progressbar"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    <span className="editorial-label">INCREMENTAL MILESTONES</span>
                    {goal.milestones && goal.milestones.map(m => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(goal.id, m.id)}
                        className="d-flex align-items-center gap-2 p-2 border transition-smooth"
                        style={{
                          borderColor: m.completed ? 'var(--border-color)' : 'var(--border-subtle)',
                          background: m.completed ? 'var(--bg-secondary)' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        {m.completed ? <CheckCircle2 size={16} className="text-light" /> : <Circle size={16} className="text-muted" />}
                        <span
                          className="font-mono text-light"
                          style={{
                            fontSize: '0.82rem',
                            textDecoration: m.completed ? 'line-through' : 'none',
                            color: m.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                          }}
                        >
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {goal.targetDate && (
                  <div className="editorial-label pt-3 border-top mt-3" style={{ borderColor: 'var(--border-subtle)' }}>
                    TARGET DEADLINE: {goal.targetDate}
                  </div>
                )}
              </div>
            </div>
          ))}

          {goals.length === 0 && (
            <div className="col-12">
              <div className="editorial-card p-5 text-center font-mono text-secondary">
                No active strategic goals established. Create your first master milestone trajectory.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1200, backdropFilter: 'blur(8px)' }}
        >
          <div className="editorial-card p-4 p-md-5" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-card)' }}>
            <span className="editorial-label mb-3 d-block">NEW ACTIONABLE TASK</span>
            <form onSubmit={handleCreateTask}>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">TASK TITLE</label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="e.g. Implement Kafka Event Consumer"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">DESCRIPTION</label>
                <textarea
                  className="editorial-input"
                  rows="2"
                  placeholder="Details, edge cases, acceptance criteria..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">PRIORITY</label>
                  <select
                    className="editorial-input"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value="HIGH">HIGH (P1)</option>
                    <option value="MEDIUM">MEDIUM (P2)</option>
                    <option value="LOW">LOW (P3)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">CATEGORY</label>
                  <select
                    className="editorial-input"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                  >
                    <option value="CODE">CODE</option>
                    <option value="STUDY">STUDY</option>
                    <option value="WORK">WORK</option>
                    <option value="LIFE">LIFE</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">DUE DATE</label>
                  <input
                    type="date"
                    className="editorial-input"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">ESTIMATED MINS</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    className="editorial-input"
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="editorial-btn editorial-btn-primary w-100 py-3">
                  QUEUE TASK
                </button>
                <button type="button" onClick={() => setShowTaskModal(false)} className="editorial-btn editorial-btn-ghost py-3">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showGoalModal && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1200, backdropFilter: 'blur(8px)' }}
        >
          <div className="editorial-card p-4 p-md-5" style={{ maxWidth: '520px', width: '100%', background: 'var(--bg-card)' }}>
            <span className="editorial-label mb-3 d-block">ESTABLISH STRATEGIC GOAL</span>
            <form onSubmit={handleCreateGoal}>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">GOAL TITLE</label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="e.g. Complete TCS NQT & Placements Prep"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">TIMEFRAME</label>
                  <select
                    className="editorial-input"
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                  >
                    <option value="LONG_TERM">LONG-TERM (QUARTER)</option>
                    <option value="WEEKLY">WEEKLY SPRINT</option>
                    <option value="DAILY">DAILY CORE OBJECTIVE</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="editorial-label mb-2 d-block">TARGET DATE</label>
                  <input
                    type="date"
                    className="editorial-input"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="editorial-label mb-2 d-block">KEY MILESTONES (3 STEPS)</label>
                {milestoneInputs.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="editorial-input mb-2"
                    placeholder={`Milestone 0${idx + 1}...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...milestoneInputs];
                      next[idx] = e.target.value;
                      setMilestoneInputs(next);
                    }}
                  />
                ))}
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="editorial-btn editorial-btn-primary w-100 py-3">
                  ESTABLISH GOAL
                </button>
                <button type="button" onClick={() => setShowGoalModal(false)} className="editorial-btn editorial-btn-ghost py-3">
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
