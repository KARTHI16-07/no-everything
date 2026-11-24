import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoMonogram from '../components/LogoMonogram';
import { ArrowRight, Lock, User, Mail, Shield, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgot) {
        // Password recovery simulation for editorial platform
        setMessage('Reset instructions sent to ' + (email || 'your registered email'));
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login({ username, password });
        navigate(from, { replace: true });
      } else {
        await register({ username, email, password });
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername('architect');
    setPassword('Pass123!');
    setIsLogin(true);
    setIsForgot(false);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 editorial-grid-bg"
      style={{ backgroundColor: 'var(--bg-primary)', marginTop: '40px' }}
    >
      <div className="editorial-card p-4 p-sm-5" style={{ maxWidth: '460px', width: '100%', background: 'var(--bg-card)' }}>
        {/* Monogram Header */}
        <div className="text-center mb-4">
          <Link to="/">
            <LogoMonogram width={140} height={42} showWordmark={false} />
          </Link>
          <div className="editorial-label mt-3">
            {isForgot
              ? 'ACCESS RECOVERY PROTOCOL'
              : isLogin
              ? 'IDENTIFICATION & AUTHENTICATION'
              : 'ENROLLMENT INTO THE ECOSYSTEM'}
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 border d-flex align-items-center gap-2 font-mono text-danger" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.82rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 mb-4 border d-flex align-items-center gap-2 font-mono text-light" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.82rem' }}>
            <Shield size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isForgot && !isLogin && (
            <div className="mb-3">
              <label className="editorial-label mb-2 d-block">EMAIL ADDRESS</label>
              <div className="position-relative">
                <input
                  type="email"
                  className="editorial-input"
                  placeholder="builder@noeverything.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {isForgot && (
            <div className="mb-3">
              <label className="editorial-label mb-2 d-block">REGISTERED EMAIL</label>
              <input
                type="email"
                className="editorial-input"
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {!isForgot && (
            <>
              <div className="mb-3">
                <label className="editorial-label mb-2 d-block">
                  {isLogin ? 'USERNAME OR EMAIL' : 'DESIRED USERNAME'}
                </label>
                <input
                  type="text"
                  className="editorial-input"
                  placeholder="e.g. architect"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="editorial-label mb-0">SECRET KEY (PASSWORD)</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setError(''); }}
                      className="btn p-0 text-decoration-none font-mono text-secondary"
                      style={{ fontSize: '0.72rem' }}
                    >
                      FORGOT KEY?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="editorial-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="editorial-btn editorial-btn-primary w-100 py-3 mb-3"
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : isForgot ? (
              <span>TRANSMIT RECOVERY LINK</span>
            ) : isLogin ? (
              <>
                <span>ENTER ARENA</span>
                <ArrowRight size={15} />
              </>
            ) : (
              <>
                <span>INITIALIZE ACCOUNT</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Pre-fill */}
        {isLogin && !isForgot && (
          <button
            type="button"
            onClick={fillDemoAccount}
            className="editorial-btn editorial-btn-outline w-100 py-2 mb-4 font-mono"
            style={{ fontSize: '0.75rem' }}
          >
            QUICK PRE-FILL DEMO ACCOUNT (architect)
          </button>
        )}

        {/* Toggle Mode */}
        <div className="text-center font-mono pt-3 border-top" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.8rem' }}>
          {isForgot ? (
            <button
              onClick={() => { setIsForgot(false); setIsLogin(true); setError(''); }}
              className="btn text-secondary p-0 font-mono"
              style={{ fontSize: '0.8rem' }}
            >
              ← RETURN TO IDENTIFICATION
            </button>
          ) : isLogin ? (
            <span className="text-secondary">
              FIRST TIME IN THE ARENA?{' '}
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className="btn text-light p-0 fw-bold font-mono text-decoration-underline"
                style={{ fontSize: '0.8rem' }}
              >
                CREATE IDENTITY
              </button>
            </span>
          ) : (
            <span className="text-secondary">
              ALREADY REGISTERED?{' '}
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className="btn text-light p-0 fw-bold font-mono text-decoration-underline"
                style={{ fontSize: '0.8rem' }}
              >
                LOG IN
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
