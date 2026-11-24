import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Shield, Lock, Bell, Moon, Sun, Save, Check, LogOut, Key } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    fullName: '',
    bio: '',
    avatarUrl: '',
    focusGoalDailyMinutes: 100,
    habitGoalDailyCount: 5,
    taskGoalDailyCount: 4,
    themePreference: 'dark',
    soundEnabled: true,
    notificationsEnabled: true,
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  ];

  useEffect(() => {
    userApi.getProfile()
      .then(res => {
        if (res.data && res.data.data) {
          setProfile(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');

    userApi.updateProfile(profile)
      .then(res => {
        setSaveStatus('Profile specifications updated.');
        updateUser({ fullName: profile.fullName, avatarUrl: profile.avatarUrl });
        setTimeout(() => setSaveStatus(''), 3000);
      })
      .catch(err => {
        setSaveStatus('Failed to update profile.');
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordStatus({ type: 'info', text: 'Updating secret key...' });

    userApi.changePassword({ currentPassword, newPassword })
      .then(() => {
        setPasswordStatus({ type: 'success', text: 'Password successfully changed.' });
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordStatus({ type: '', text: '' }), 4000);
      })
      .catch(err => {
        setPasswordStatus({ type: 'danger', text: err.response?.data?.message || 'Password update failed.' });
      });
  };

  return (
    <div className="container-fluid px-lg-5 px-3 py-5" style={{ marginTop: '70px', minHeight: '90vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end pb-4 mb-5 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <span className="editorial-label">STATION COMMANDER // IDENTITY CONFIGURATION</span>
          <h1 className="font-headline display-5 fw-bold text-uppercase mt-1 mb-1">
            USER PROFILE & SYSTEM SETTINGS
          </h1>
          <p className="font-mono text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            Manage identity telemetry, daily objective thresholds, and cryptographic credentials.
          </p>
        </div>

        <button onClick={logout} className="editorial-btn editorial-btn-outline mt-3 mt-md-0 font-mono">
          <LogOut size={14} />
          <span>SIGN OUT</span>
        </button>
      </div>

      <div className="row g-5">
        {/* Left Column: Profile Information & Goals */}
        <div className="col-lg-7">
          <form onSubmit={handleUpdateProfile}>
            <div className="editorial-card p-4 p-md-5 mb-4">
              <span className="editorial-label mb-3 d-block">IDENTITY DATA</span>

              {/* Avatar Selector */}
              <div className="mb-4">
                <label className="editorial-label mb-2 d-block">AVATAR SPECIFICATION</label>
                <div className="d-flex gap-3 align-items-center">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      border: '2px solid var(--border-color)',
                      backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!profile.avatarUrl && <User size={24} className="text-secondary" />}
                  </div>

                  <div className="d-flex gap-2">
                    {avatars.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setProfile({ ...profile, avatarUrl: url })}
                        className="cursor-pointer border transition-smooth"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundImage: `url(${url})`,
                          backgroundSize: 'cover',
                          borderColor: profile.avatarUrl === url ? '#FFFFFF' : 'var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="editorial-label mb-2 d-block">FULL NAME</label>
                  <input
                    type="text"
                    className="editorial-input"
                    value={profile.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="editorial-label mb-2 d-block">USERNAME (IMMUTABLE)</label>
                  <input
                    type="text"
                    className="editorial-input"
                    value={user?.username || ''}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="editorial-label mb-2 d-block">PERSONAL MANIFESTO / BIO</label>
                <textarea
                  className="editorial-input"
                  rows="3"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              {/* Goal Thresholds */}
              <span className="editorial-label mb-3 d-block pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                DAILY TARGET PARAMETERS
              </span>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="editorial-label mb-2 d-block">DAILY FOCUS (MINS)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    className="editorial-input"
                    value={profile.focusGoalDailyMinutes || 100}
                    onChange={(e) => setProfile({ ...profile, focusGoalDailyMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="editorial-label mb-2 d-block">DAILY HABITS GOAL</label>
                  <input
                    type="number"
                    min="1"
                    className="editorial-input"
                    value={profile.habitGoalDailyCount || 5}
                    onChange={(e) => setProfile({ ...profile, habitGoalDailyCount: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="editorial-label mb-2 d-block">DAILY TASKS GOAL</label>
                  <input
                    type="number"
                    min="1"
                    className="editorial-input"
                    value={profile.taskGoalDailyCount || 4}
                    onChange={(e) => setProfile({ ...profile, taskGoalDailyCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <button type="submit" className="editorial-btn editorial-btn-primary py-3 px-5">
                  <Save size={15} />
                  <span>COMMIT SPECIFICATIONS</span>
                </button>
                {saveStatus && (
                  <span className="font-mono text-light" style={{ fontSize: '0.8rem' }}>{saveStatus}</span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Preferences */}
        <div className="col-lg-5">
          {/* Security & Password */}
          <div className="editorial-card p-4 mb-4">
            <span className="editorial-label mb-3 d-block">CRYPTOGRAPHIC SECURITY</span>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">CURRENT PASSWORD</label>
                <input
                  type="password"
                  className="editorial-input"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">NEW MASTER PASSWORD</label>
                <input
                  type="password"
                  className="editorial-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="editorial-btn editorial-btn-outline w-100 py-3 mb-2">
                <Key size={15} />
                <span>ROTATE SECRET KEY</span>
              </button>

              {passwordStatus.text && (
                <div className={`p-2 font-mono text-center mt-2 border ${passwordStatus.type === 'danger' ? 'text-danger' : 'text-light'}`} style={{ borderColor: 'var(--border-subtle)', fontSize: '0.78rem' }}>
                  {passwordStatus.text}
                </div>
              )}
            </form>
          </div>

          {/* System Preferences */}
          <div className="editorial-card p-4">
            <span className="editorial-label mb-3 d-block">SYSTEM ENVIRONMENT</span>

            <div className="d-flex justify-content-between align-items-center py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <div className="font-headline fs-6 text-light">Visual Identity</div>
                <div className="editorial-label">Current: {isDark ? 'DEEP BLACK MONOCHROME' : 'OFF-WHITE EDITORIAL'}</div>
              </div>
              <button onClick={toggleTheme} className="editorial-btn editorial-btn-outline py-2 px-3">
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                <span>{isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <div className="font-headline fs-6 text-light">Web Audio Synthesis</div>
                <div className="editorial-label">Focus binaural beats & timer bell</div>
              </div>
              <input
                type="checkbox"
                checked={profile.soundEnabled}
                onChange={(e) => setProfile({ ...profile, soundEnabled: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#FFFFFF' }}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-3">
              <div>
                <div className="font-headline fs-6 text-light">System Telemetry Logs</div>
                <div className="editorial-label">Audit tracking of habit completions</div>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationsEnabled}
                onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#FFFFFF' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
